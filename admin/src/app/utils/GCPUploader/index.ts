import imageCompression from 'browser-image-compression';
const fileTypes = {
  banner: { maxSizeMB: 1, maxWidthOrHeight: 1920 },
  generic: { maxSizeMB: 1, maxWidthOrHeight: 1600 },
  thumbnail: { maxSizeMB: 0.5, maxWidthOrHeight: 480 },
} as const;

type FileType = keyof typeof fileTypes;
export async function compressFile(file: File, type: FileType = "generic"): Promise<File> {
  const isImage = file.type.startsWith('image/');
  const { maxSizeMB, maxWidthOrHeight } = fileTypes[type];

  if (isImage) {
    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
    };
    const compressed = await imageCompression(file, options);
    return compressed;
  }
  // Handle videos or other types as-is for now
  return file;
}

export async function uploadToGCS(file: File, type: FileType = "generic"): Promise<string> {
  const isImage = file.type.startsWith('image/');
  // 1. Get a presigned URL from the API route
  const compressedFile = isImage ? await compressFile(file, type) : file;
  const presignRes = await fetch(
    `/api/gcs-presign?filename=${encodeURIComponent(compressedFile.name)}&contentType=${compressedFile.type}`
  );
  
  if (!presignRes.ok) {
    throw new Error('Failed to get signed URL');
  }

  const { uploadUrl, publicUrl } = await presignRes.json();

  // 2. Upload the file directly to GCS using the signed URL
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': compressedFile.type,
    },
    body: compressedFile,
  });

  if (!uploadRes.ok) {
    throw new Error('Failed to upload file to GCS');
  }

  // 3. Return the public URL to store in state or database
  return publicUrl;
}