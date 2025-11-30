import { NextRequest, NextResponse } from "next/server";
import { 
  GoogleGenAI, 
  createUserContent, 
  createPartFromUri 
} from "@google/genai";
import fs from "fs";
import path from "path";
import os from "os";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

// Initialize the new GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

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

    // 2. Upload using the new SDK (GoogleGenAI)
    const uploadResult = await ai.files.upload({
      file: tempFilePath,
      config: { 
        mimeType: file.type, 
        displayName: file.name 
      },
    });

    // --- FIX: TYPE GUARD ---
    // This ensures typescript knows name and uri are strings, not undefined
    if (!uploadResult.name || !uploadResult.uri) {
      throw new Error("Upload failed: GenAI did not return a valid name or URI.");
    }

    // 3. Poll for processing (Crucial for video files)
    let fileState = uploadResult.state;
    let currentFile = uploadResult;

    // We loop while state is PROCESSING 
    while (fileState === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Fetch fresh status using the new SDK
      // Valid because we checked uploadResult.name above
      currentFile = await ai.files.get({ name: uploadResult.name });
      fileState = currentFile.state;
      
      if (fileState === "FAILED") {
        throw new Error("Video processing failed.");
      }
    }

    // 4. Construct Prompt
    const prompt = `### ROLE
You are a Precision Video Logger.
### TASK
Analyze the video clip and output a SINGLE string of text (40-75 words) describing the visual content for an AI editor.
Identify specific public figures or characters. Focus intently on the chronological order of interactions and subtle tonal shifts.
### FORMATTING RULES
1. Start with the Technical Specs in brackets: [Shot Type, Camera Movement, Lighting].
2. Follow immediately with a vivid description. Name the specific characters/celebrities.
Describe exact object interactions (who gives/takes what) and capture any contrast in tone (e.g., humor within drama).
3. End with the mood/atmosphere.
4. Do NOT use JSON or bullet points. Just one block of text.
### EXAMPLE OUTPUT
[Medium Shot, Static, Cinematic War-Torn] Captain America and Thor stand amidst rubble.
In a moment of lighthearted camaraderie, they swap weapons: Thor takes the massive Stormbreaker axe while Captain America catches the smaller Mjolnir hammer.
Thor smiles, noting the trade. The vibe is epic yet briefly comedic and brotherly.
### EXTRACTION RULE
After the description block, create a new line and strictly output: "||INDIVIDUALS||: " followed by a comma-separated list of the names of the identified individuals.`;

    // 5. Generate Content
    try {
      const response = await ai.models.generateContent({
        model: usedModel,
        contents: createUserContent([
          // Valid because we checked uploadResult.uri above
          createPartFromUri(uploadResult.uri, file.type),
          prompt,
        ]),
      });
      
      text = response.text || "";

    } catch (err) {
      console.warn("Flash failed, falling back to Flash-Lite", err);
      usedModel = "gemini-2.5-flash-lite";
      
      const response = await ai.models.generateContent({
        model: usedModel,
        contents: createUserContent([
            createPartFromUri(uploadResult.uri, file.type),
            prompt,
        ]),
      });
      
      text = response.text || "";
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
