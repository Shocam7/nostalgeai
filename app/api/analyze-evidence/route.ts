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
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Write temp file
    const buffer = Buffer.from(await file.arrayBuffer());
    tempPath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
    await fs.writeFile(tempPath, buffer);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const fileManager = genAI.getFileManager();

    let mediaPart: any = null;

    // IMAGE → allowed via inlineData
    if (file.type.startsWith("image/")) {
      const base64 = buffer.toString("base64");
      mediaPart = {
        inlineData: {
          data: base64,
          mimeType: file.type,
        },
      };
    }

    // VIDEO → must upload through file manager
    else if (file.type.startsWith("video/")) {
      const upload = await fileManager.uploadFile(tempPath, {
        mimeType: file.type,
        displayName: file.name,
      });

      mediaPart = {
        fileData: {
          fileUri: upload.file.uri,
          mimeType: file.type,
        },
      };
    }

    const prompt = `
### ROLE
You are a Precision Video Logger.

### TASK
Analyze the footage and output ONLY:

1) Clean description
2) "||INDIVIDUALS||: name1, name2"
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const start = Date.now();
    let finalText = "";

    // correct v2 format → array of parts
    const stream = await model.generateContentStream([
      mediaPart,
      { text: prompt },
    ]);

    for await (const chunk of stream.stream) {
      if (chunk.text) finalText += chunk.text;
    }

    await fs.unlink(tempPath).catch(() => {});

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
