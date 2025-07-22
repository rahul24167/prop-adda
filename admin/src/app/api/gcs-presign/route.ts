import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

const decoded = Buffer.from(process.env.GCP_KEY_B64!, 'base64').toString('utf-8');
const credentials = JSON.parse(decoded);
const storage = new Storage({credentials});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const originalFilename = searchParams.get("filename");
  const contentType = searchParams.get("contentType");

  if (!originalFilename || !contentType) {
    return NextResponse.json(
      { error: "Missing filename or contentType" },
      { status: 400 }
    );
  }

  const isImage = contentType.startsWith("image/");
  const isVideo = contentType.startsWith("video/");
  const folder = isImage ? "images" : isVideo ? "raw" : "others";

  const uniqueFilename = `${folder}/${uuidv4()}`;

  const file = bucket.file(uniqueFilename);

  const [uploadUrl] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000,
    contentType,
  });
  const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${uniqueFilename}`;

  return NextResponse.json({ uploadUrl, publicUrl });
}
