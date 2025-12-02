// app/api/b2/upload/route.ts

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { supabase } from "@/lib/supabaseClient";

const b2 = new S3Client({
  region: process.env.B2_REGION,
  endpoint: process.env.B2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  }
});

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const file = form.get("file") as File | null;
    const memoryId = form.get("memoryId") as string | null;
    const folderName = form.get("folderName") as string | null;

    if (!file || !memoryId)
      return Response.json({ error: "Missing file or memoryId" }, { status: 400 });

    if (!folderName)
      return Response.json({ error: "Missing folderName" }, { status: 400 });

    // -------------------------------
    // STEP 1 — Get existing clip count
    // -------------------------------
    const { data, error: countError } = await supabase
      .from("memory_movies")
      .select("clips_count")
      .eq("id", memoryId)
      .single();

    if (countError)
      throw new Error("Unable to fetch clip count: " + countError.message);

    const nextIndex = (data?.clips_count ?? 0) + 1;

    // -------------------------------
    // STEP 2 — Build deterministic file name
    // -------------------------------
    const original = file.name || "";
    const ext = original.includes(".") ? original.split(".").pop() : "mp4";

    const fileName = `${nextIndex}.${ext}`;
    const key = `${folderName}/${fileName}`;

    // -------------------------------
    // STEP 3 — Upload to Backblaze
    // -------------------------------
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await b2.send(
      new PutObjectCommand({
        Bucket: process.env.B2_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type
      })
    );

    // -------------------------------
    // STEP 4 — Return the new key
    // -------------------------------
    return Response.json({
      success: true,
      key,
      index: nextIndex,
      b2Response: uploadResult
    });

  } catch (err: any) {
    console.error("Upload error:", err);
    return Response.json(
      { error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
