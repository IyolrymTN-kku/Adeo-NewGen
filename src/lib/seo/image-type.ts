const ALLOWED_OG_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

export function isValidOGImage(url?: string | null) {
  if (!url) return false;

  const lower = url.toLowerCase();

  return ALLOWED_OG_EXTENSIONS.some((ext) =>
    lower.endsWith(ext)
  );
}