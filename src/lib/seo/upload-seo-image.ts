export async function uploadSeoImage(file: File) {
  if (!file) throw new Error("No file provided");

  const fileName = `${Date.now()}-${file.name}`;

  const url = `/uploads/${fileName}`;

  return {
    url,
  };
}