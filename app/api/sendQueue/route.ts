
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

  const item =
    await prisma.emailQueue.findUnique({
      where: { id },
    });

  if (!item) {
    return NextResponse.json({
      error: "not found",
    });
  }

  await sendMail(
    item.to,
    "Referral request",
    item.text
  );

  await prisma.emailQueue.update({
    where: { id },
    data: {
      status: "sent",
    },
  });

  return NextResponse.json({
    sent: true,
  });
}