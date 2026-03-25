
import { generateMessage } from "@/app/lib/messageAI";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const employees = await prisma.employee.findMany({
    take: 5,
  });

  const job = await prisma.job.findFirst();

  if (!job) {
    return NextResponse.json({
      error: "No job found",
    });
  }

  for (const e of employees) {
    const text = await generateMessage(
      e.name,
      job.title
    );

    await prisma.message.create({
      data: {
        text: text || "",
        employeeId: e.id,
        jobTitle: job.title,
      },
    });
  }

  return NextResponse.json({
    success: true,
  });
}