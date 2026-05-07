import { randomBytes } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
};

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

/**
 * Saves an uploaded image to public/uploads/ and returns a relative URL.
 *
 * Validates MIME type (server-side) and size, generates a random filename
 * (never trusting user input), and writes via fs/promises. Path traversal is
 * impossible because we compose the path from a fixed prefix + random bytes.
 */
export async function saveUploadedImage(file: File): Promise<string> {
  if (file.size === 0) {
    throw new UploadError("Uploaded file is empty.");
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("Image must be 5 MB or smaller.");
  }
  if (!ALLOWED_MIME.has(file.type)) {
    throw new UploadError(
      "Unsupported image format. Use JPG, PNG, WebP, or SVG."
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = EXT_BY_MIME[file.type] ?? ".bin";
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  const fullPath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  return `/uploads/${filename}`;
}

/**
 * Best-effort deletion of a previously uploaded file. Silently ignores
 * missing files and any path that doesn't sit inside our uploads dir
 * (e.g. seed placeholders). Never throws.
 */
export async function deleteUploadedImage(
  relativeUrl: string | null | undefined
): Promise<void> {
  if (!relativeUrl) return;
  if (!relativeUrl.startsWith("/uploads/")) return;

  const filename = path.basename(relativeUrl);
  // Reject anything that resolves outside our uploads dir.
  const resolved = path.resolve(UPLOAD_DIR, filename);
  if (path.dirname(resolved) !== UPLOAD_DIR) return;

  // Skip seed placeholder.
  if (filename === "placeholder-logo.svg") return;

  try {
    await unlink(resolved);
  } catch {
    // ignore — file may already be gone
  }
}

export function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof File !== "undefined" &&
    value instanceof File &&
    value.size > 0 &&
    value.name !== ""
  );
}
