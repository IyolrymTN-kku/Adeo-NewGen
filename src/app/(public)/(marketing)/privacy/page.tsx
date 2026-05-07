import { generateSEOMetadata } from "@/lib/seo/generate";

// export const metadata = generateSEOMetadata("/privacy");

export async function generateMetadata() {
  return generateSEOMetadata("/privacy");
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-sm text-slate-600">
        We protect your data and privacy.
      </p>
    </main>
  );
}