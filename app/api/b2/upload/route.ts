// app/api/b2/upload/route.ts

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const b2 = new S3Client({
  region: process.env.B2_REGION,
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  }
});

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const memoryId = form.get("memoryId") as string;

    if (!file || !memoryId) {
      return Response.json({ error: "Missing file or memoryId" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${memoryId}/${crypto.randomUUID()}.mp4`;

    const upload = await b2.send(
      new PutObjectCommand({
        Bucket: process.env.B2_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type
      })
    );

    return Response.json({
      success: true,
      key,
      upload
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return Response.json(
      { error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
