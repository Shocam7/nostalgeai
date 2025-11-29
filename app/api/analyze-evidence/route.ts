// app/api/analyze-evidence/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import fs from "fs/promises";
import path from "path";
import os from "os";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ✅ Convert file to Buffer safely (NO STREAMING BUGS)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write to temp dir
    const tempPath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
    await fs.writeFile(tempPath, buffer);

    const start = Date.now();
    let usedModel = "gemini-2.5-flash";

    // Upload to Gemini
    const upload = await fileManager.uploadFile(tempPath, {
      mimeType: file.type,
      displayName: file.name
    });

    let fileUri = upload.file.uri;
    let fileName = upload.file.name;
    let state = upload.file.state;

    // Poll processing status
    while (state === FileState.PROCESSING) {
      await new Promise((r) => setTimeout(r, 1500));
      const updated = await fileManager.getFile(fileName);
      state = updated.state;
      if (state === FileState.FAILED) {
        throw new Error("Gemini failed to process file.");
      }
    }

    const prompt = `### ROLE
You are a Precision Video Logger.

### TASK
Analyze the video clip and output a SINGLE string of text (40-75 words)...

### EXTRACTION RULE
After the description block, create a new line and output: "||INDIVIDUALS||: " followed by names.`;


    // Try main model
    let outputText = "";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent([
        { fileData: { mimeType: file.type, fileUri } },
        { text: prompt }
      ]);
      outputText = result.response.text();
    } catch (e) {
      usedModel = "gemini-2.5-flash-lite";
      const model = genAI.getGenerativeModel({ model: usedModel });
      const result = await model.generateContent([
        { fileData: { mimeType: file.type, fileUri } },
        { text: prompt }
      ]);
      outputText = result.response.text();
    }

    // Cleanup
    await fs.unlink(tempPath);

    const duration = ((Date.now() - start) / 1000).toFixed(3);

    // Parsing
    const parts = outputText.split("||INDIVIDUALS||:");
    const description = parts[0].trim();
    const individuals = (parts[1] || "").trim();

    return NextResponse.json({
      description,
      individuals,
      model: usedModel,
      duration
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
      }
