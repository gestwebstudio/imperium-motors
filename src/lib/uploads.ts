import "server-only";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function saveUploadedImage(file: File, subdir: string) {
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    throw new Error("Разрешены только изображения: JPG, PNG, WEBP, GIF");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Файл слишком большой (максимум 8 МБ)");
  }

  const dir = path.join(process.cwd(), "public", "uploads", subdir);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);

  return `/uploads/${subdir}/${filename}`;
}
