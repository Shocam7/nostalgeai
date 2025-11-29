// app/api/analyze-evidence/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  GoogleAIFileManager
} from "@google/generative-ai";

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

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const fileManager = new GoogleAIFileManager({ apiKey: process.env.GOOGLE_API_KEY! });

    // Upload the video file
    let upload = await fileManager.uploadFile(tempPath, {
      mimeType: file.type,
      displayName: file.name,
    });

    // Poll until ready
    while (true) {
      const status = await fileManager.getFile(upload.file.name);

      if (status.state === "ACTIVE") break;
      if (status.state === "FAILED") throw new Error("Gemini file processing failed.");

      await new Promise(r => setTimeout(r, 1500));
    }

    // Prompt
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
    let model = "gemini-1.5-pro"; // safe, available model
    let finalText = "";

    try {
      const stream = await genAI
        .getGenerativeModel({ model })
        .generateContentStream({
          contents: [
            {
              fileData: {
                fileUri: upload.file.uri,
                mimeType: file.type,
              },
            },
            { text: prompt },
          ],
        });

      for await (const chunk of stream.stream) {
        if (chunk.text) finalText += chunk.text;
      }
    } catch (err) {
      // retry with flash
      model = "gemini-1.5-flash";

      const stream = await genAI
        .getGenerativeModel({ model })
        .generateContentStream({
          contents: [
            {
              fileData: {
                fileUri: upload.file.uri,
                mimeType: file.type,
              },
            },
            { text: prompt },
          ],
        });

      for await (const chunk of stream.stream) {
        if (chunk.text) finalText += chunk.text;
      }
    }

    await fs.unlink(tempPath);

    // Parse response
    const [desc, people = ""] = finalText.split("||INDIVIDUALS||:");

    return NextResponse.json({
      description: desc.trim(),
      individuals: people.trim(),
      model,
      duration: ((Date.now() - start) / 1000).toFixed(2),
    });

  } catch (err: any) {
    if (tempPath) await fs.unlink(tempPath).catch(() => {});
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
