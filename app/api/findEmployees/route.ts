import { findGoogleEmployees } from "@/app/lib/linkedinFinder";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  const people = await findGoogleEmployees();

  for (const p of people) {
    await prisma.employee.create({
      data: {
        name: p.name || "unknown",
        role: "unknown",
        profile: p.profile,
        company: "Google",
      },
    });
  }

  return NextResponse.json({
    saved: people.length,
  });
}