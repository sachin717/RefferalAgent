import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const leadId = String(formData.get("leadId") || "").trim();

    if (!leadId) {
      return NextResponse.redirect(new URL("/leads", req.url));
    }

    const now = new Date();
    const nextFollowUp = new Date(now);
    nextFollowUp.setDate(nextFollowUp.getDate() + 3);

    await prisma.outreachLead.update({
      where: { id: leadId },
      data: {
        status: "messaged",
        lastContacted: now,
        nextFollowUp,
      },
    });

    return NextResponse.redirect(new URL("/leads", req.url));
  } catch (error) {
    console.error("Error marking lead as messaged:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}