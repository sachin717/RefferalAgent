
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = String(formData.get("title") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const source = String(formData.get("source") || "").trim();
    const link = String(formData.get("link") || "").trim();
    const status = String(formData.get("status") || "discovered").trim();
    const matchScoreRaw = String(formData.get("matchScore") || "0").trim();

    const matchScore = Number(matchScoreRaw) || 0;

    if (!title || !company) {
      return NextResponse.redirect(new URL("/jobs", req.url));
    }

    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.redirect(new URL("/jobs", req.url));
    }

    await prisma.job.create({
      data: {
        userId: user.id,
        title,
        company,
        location: location || null,
        source: source || null,
        link: link || null,
        status: status || "discovered",
        matchScore,
      },
    });

    return NextResponse.redirect(new URL("/jobs", req.url));
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}