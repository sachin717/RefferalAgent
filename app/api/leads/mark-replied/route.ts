import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const leadId = String(formData.get("leadId") || "").trim();

    if (!leadId) {
      return NextResponse.redirect(new URL("/leads", req.url));
    }

    await prisma.outreachLead.update({
      where: { id: leadId },
      data: {
        status: "replied",
        nextFollowUp: null, // stop follow-ups
      },
    });

    return NextResponse.redirect(new URL("/leads", req.url));
  } catch (error) {
    console.error("Error marking replied:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}