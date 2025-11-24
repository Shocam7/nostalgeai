// lib/b2.ts
import { S3Client } from "@aws-sdk/client-s3";

export const b2 = new S3Client({
  region: "us-east-005", // change to your region
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  }
});
