import { generateSEOMetadata } from "@/lib/seo/generate";

export async function generateMetadata() {
  return generateSEOMetadata("/about");
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold">About Us</h1>
      <p className="mt-4 text-sm text-slate-600">
        Overview of the company, mission, and vision.
      </p>
    </main>
  );
}