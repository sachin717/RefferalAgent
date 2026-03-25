
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const s =
    await prisma.settings.findFirst();

  if (!s) return prisma.settings.create(
    {
        data: {
      automation: true,
    }, 
    }
  );

  await prisma.settings.update({
    where: { id: s.id },
    data: {
      automation: !s.automation,
    },
  });

  return NextResponse.json({
    toggled: !s.automation,
  });
}