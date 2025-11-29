import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import os from "os";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Save file temporarily
    const tempFilePath = path.join(os.tmpdir(), file.name);
    await pump(file.stream() as any, fs.createWriteStream(tempFilePath));

    const startTime = Date.now();
    let usedModel = "gemini-2.5-flash";
    let text = "";

    // 2. Upload to Gemini
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: file.type,
      displayName: file.name,
    });

    let fileUri = uploadResult.file.uri;
    let fileName = uploadResult.file.name;

    // 3. Poll for processing
    let state = uploadResult.file.state;
    while (state === FileState.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const fileStatus = await fileManager.getFile(fileName);
      state = fileStatus.state;
      if (state === FileState.FAILED) {
        throw new Error("Video processing failed.");
      }
    }

    // 4. Construct Prompt (Matching streamlit_app.py + Data Extraction)
    const prompt = `### ROLE
You are a Precision Video Logger.

### TASK
Analyze the video clip and output a SINGLE string of text (40-75 words) describing the visual content for an AI editor. Identify specific public figures or characters. Focus intently on the chronological order of interactions and subtle tonal shifts.

### FORMATTING RULES
1. Start with the Technical Specs in brackets: [Shot Type, Camera Movement, Lighting].
2. Follow immediately with a vivid description. Name the specific characters/celebrities. Describe exact object interactions (who gives/takes what) and capture any contrast in tone (e.g., humor within drama).
3. End with the mood/atmosphere.
4. Do NOT use JSON or bullet points. Just one block of text.


### EXAMPLE OUTPUT
[Medium Shot, Static, Cinematic War-Torn] Captain America and Thor stand amidst rubble. In a moment of lighthearted camaraderie, they swap weapons: Thor takes the massive Stormbreaker axe while Captain America catches the smaller Mjolnir hammer. Thor smiles, noting the trade. The vibe is epic yet briefly comedic and brotherly.

### EXTRACTION RULE
After the description block, create a new line and strictly output: "||INDIVIDUALS||: " followed by a comma-separated list of the names of the identified individuals.`;

    // 5. Generate Content with Fallback Logic
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent([
        { fileData: { mimeType: file.type, fileUri: fileUri } },
        { text: prompt }
      ]);
      text = result.response.text();
    } catch (err) {
      console.warn("Flash failed, falling back to Flash-Lite", err);
      usedModel = "gemini-2.5-flash-lite";
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      const result = await model.generateContent([
        { fileData: { mimeType: file.type, fileUri: fileUri } },
        { text: prompt }
      ]);
      text = result.response.text();
    }

    // 6. Cleanup
    fs.unlinkSync(tempFilePath);
    
    // 7. Calculate Time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // 8. Parse Output
    const parts = text.split("||INDIVIDUALS||:");
    const description = parts[0].trim();
    const individuals = parts[1] ? parts[1].trim() : "";

    return NextResponse.json({
      description,
      individuals,
      model: usedModel,
      duration: duration.toFixed(3),
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
