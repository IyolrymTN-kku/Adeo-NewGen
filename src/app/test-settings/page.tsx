import { prisma } from "@/lib/db";

export default async function TestSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Site Settings</h1>

      <pre>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  );
}