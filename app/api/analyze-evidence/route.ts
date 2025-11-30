// app/api/analyze-evidence/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import os from "os";
import path from "path";

export async function POST(req: NextRequest) {
  let tempPath = "";

  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    tempPath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
    await fs.writeFile(tempPath, buffer);

    // Convert to Base64 inline data for Gemini
    const base64 = buffer.toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const prompt = `
### ROLE
You are a Precision Video Logger.

### TASK
Analyze the video and output a SINGLE string of text.

### EXTRACTION RULE
After the description, output:
"||INDIVIDUALS||: " + comma separated names.
`;

    const start = Date.now();
    let finalText = "";

    const stream = await model.generateContentStream({
      contents: [
        {
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        },
        { text: prompt },
      ],
    });

    for await (const chunk of stream.stream) {
      if (chunk.text) finalText += chunk.text;
    }

    await fs.unlink(tempPath);

    const [desc, people = ""] = finalText.split("||INDIVIDUALS||:");

    return NextResponse.json({
      description: desc.trim(),
      individuals: people.trim(),
      model: "gemini-1.5-pro",
      duration: ((Date.now() - start) / 1000).toFixed(2),
    });

  } catch (err: any) {
    if (tempPath) await fs.unlink(tempPath).catch(() => {});
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
