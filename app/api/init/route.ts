
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const s = await prisma.settings.findFirst();

  if (!s) {
    await prisma.settings.create({
      data: {},
    });
  }

  return NextResponse.json({
    ok: true,
  });
}