// app/api/analyze-evidence/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@google/generative-ai";
import fs from "fs/promises";
import os from "os";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Write to temp path
    const tempPath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
    await fs.writeFile(tempPath, buffer);

    const client = new Client({ apiKey: process.env.GOOGLE_API_KEY! });

    // Upload to Gemini
    let fileObj = await client.files.upload(tempPath, {
      mimeType: file.type,
      displayName: file.name
    });

    // Poll for processing
    while (fileObj.state === "PROCESSING") {
      await new Promise((r) => setTimeout(r, 1500));
      fileObj = await client.files.get(fileObj.name);
      if (fileObj.state === "FAILED") {
        throw new Error("File processing failed.");
      }
    }

    const prompt = `
### ROLE
You are a Precision Video Logger.

### TASK
Analyze the video clip and output a SINGLE string of text...

### EXTRACTION RULE
After the description block, output:
"||INDIVIDUALS||: " + comma separated names.
`;

    const start = Date.now();
    let usedModel = "gemini-2.5-flash";

    let finalText = "";

    try {
      for await (const chunk of client.models.generateContentStream({
        model: usedModel,
        contents: [fileObj, prompt]
      })) {
        if (chunk.text) finalText += chunk.text;
      }
    } catch (e) {
      // fallback to flash-lite
      usedModel = "gemini-2.5-flash-lite";
      for await (const chunk of client.models.generateContentStream({
        model: usedModel,
        contents: [fileObj, prompt]
      })) {
        if (chunk.text) finalText += chunk.text;
      }
    }

    // Cleanup temp file
    await fs.unlink(tempPath);

    const duration = ((Date.now() - start) / 1000).toFixed(3);

    // Parse output
    const parts = finalText.split("||INDIVIDUALS||:");
    const description = parts[0].trim();
    const individuals = parts[1]?.trim() || "";

    return NextResponse.json({
      description,
      individuals,
      model: usedModel,
      duration
    });

  } catch (e: any) {
    console.error("ERROR:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
