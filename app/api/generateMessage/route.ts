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
      orderBy: { id: "desc" },
    });

    if (!job) {
      return NextResponse.json(
        { error: `No job found for ${emp.company}` },
        { status: 404 }
      );
    }

    const text = await generateMessage(emp.name, job.title);

    const savedMessage = await prisma.message.create({
      data: {
        text: text || "",
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
    console.error("generateMessage error:", error);

    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}