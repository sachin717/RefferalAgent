import { generateMessage } from "@/app/lib/messageAI";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Employee id is required" },
        { status: 400 }
      );
    }

    const emp = await prisma.employee.findUnique({
      where: { id },
    });

    if (!emp) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const job = await prisma.job.findFirst({
      where: { company: emp.company },
      orderBy: { title: "asc" },
    });

    if (!job) {
      return NextResponse.json(
        { error: `No job found for ${emp.company}` },
        { status: 404 }
      );
    }

    let text = "";

    try {
      text = await generateMessage(emp.name, job.title);
    } catch (aiError) {
      console.error("AI generation failed:", aiError);

      text = `Hi ${emp.name},

I hope you are doing well.

I am currently exploring opportunities for ${job.title} at ${emp.company} and would really appreciate your guidance or a referral if possible.

Thanks,
Sachin`;
    }

    const savedMessage = await prisma.message.create({
      data: {
        text,
        employeeId: emp.id,
        jobTitle: job.title,
        company: emp.company,
      },
    });

    return NextResponse.json({
      ok: true,
      message: savedMessage,
      preview: savedMessage.text,
    });
  } catch (error) {
    console.error("generateMessage route error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate message",
      },
      { status: 500 }
    );
  }
}