import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = String(formData.get("name") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const role = String(formData.get("role") || "").trim();
    const linkedinUrl = String(formData.get("linkedinUrl") || "").trim();
    const source = String(formData.get("source") || "").trim();
    const commonGround = String(formData.get("commonGround") || "").trim();
    const notes = String(formData.get("notes") || "").trim();
    const status = String(formData.get("status") || "new").trim();
    const priorityScoreRaw = String(formData.get("priorityScore") || "0").trim();

    const priorityScore = Number(priorityScoreRaw) || 0;

    if (!name || !company) {
      return NextResponse.redirect(new URL("/leads", req.url));
    }

    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.redirect(new URL("/leads", req.url));
    }

    await prisma.outreachLead.create({
      data: {
        userId: user.id,
        name,
        company,
        role: role || null,
        linkedinUrl: linkedinUrl || null,
        source: source || null,
        commonGround: commonGround || null,
        notes: notes || null,
        status: status || "new",
        priorityScore,
      },
    });

    return NextResponse.redirect(new URL("/leads", req.url));
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}