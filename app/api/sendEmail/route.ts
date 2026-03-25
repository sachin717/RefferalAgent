
import { sendMail } from "@/app/lib/mailre";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({
      error: "no id",
    });
  }

  const message = await prisma.message.findUnique({
    where: { id },
  });

  if (!message) {
    return NextResponse.json({
      error: "no message",
    });
  }

  const to = "test@email.com";

  await sendMail(
    to,
    "Referral request",
    message.text
  );

  await prisma.emailLog.create({
    data: {
      to,
      subject: "Referral request",
      status: "sent",
    },
  });

  return NextResponse.json({
    sent: true,
  });
}