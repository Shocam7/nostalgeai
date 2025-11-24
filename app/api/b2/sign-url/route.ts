import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const b2 = new S3Client({
  region: process.env.B2_REGION,
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  }
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET!,
    Key: key
  });

  // URL valid for 2 hours
  const signedUrl = await getSignedUrl(b2, command, { expiresIn: 7200 });

  return Response.json({ url: signedUrl });
}
