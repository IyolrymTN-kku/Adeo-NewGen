// app/api/admin/theme/route.ts

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const DEFAULT = {
  primary:   "#0066FF",
  secondary: "#0A1628",
  accent:    "#3385FF",
  muted:     "#EFF6FF",
  success:   "#22C55E",
};

// POST /api/admin/theme — Save Theme
export async function POST(req: Request) {
  const body = await req.json();
  const { primary, secondary, accent, muted, success } = body;

  const hexRe = /^#[0-9A-Fa-f]{6}$/;
  if (![primary, secondary, accent, muted, success].every((c) => hexRe.test(c))) {
    return NextResponse.json({ error: "Invalid color format" }, { status: 400 });
  }

  await prisma.adminTheme.upsert({
    where:  { id: 1 },
    update: { primary, secondary, accent, muted, success },
    create: { primary, secondary, accent, muted, success },
  });

  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/theme — Reset to default
export async function DELETE() {
  await prisma.adminTheme.upsert({
    where:  { id: 1 },
    update: DEFAULT,
    create: DEFAULT,
  });

  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}

// GET /api/admin/theme — อ่าน theme ปัจจุบัน
export async function GET() {
  const theme = await prisma.adminTheme.findUnique({ where: { id: 1 } });
  return NextResponse.json(theme ?? DEFAULT);
}