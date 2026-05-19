import { generateSEOMetadata } from "@/lib/seo/generate";

export async function generateMetadata() {
  return generateSEOMetadata("/terms");
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-sm text-slate-600">
        Rules and conditions for using this website.
      </p>
    </main>
  );
}