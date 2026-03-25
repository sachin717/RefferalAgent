import { findEmailApollo } from "@/app/lib/apollo";
import { sendMail } from "@/app/lib/mailre";
import { generateMessage } from "@/app/lib/messageAI";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const { id } = await req.json();

  const emp = await prisma.employee.findUnique({
    where: { id },
  });

  if (!emp) {
    return NextResponse.json({ error: true });
  }

  let email = emp.email;

  // ✅ find email from Apollo if missing
  if (!email) {
    email = await findEmailApollo(
      emp.name,
      emp.company
    );

    if (email) {
      await prisma.employee.update({
        where: { id },
        data: { email },
      });
    }
  }

  if (!email) {
    return NextResponse.json({
      error: "no email",
    });
  }

  // ✅ AI message
  const text = await generateMessage(
    emp.name,
    emp.company
  );

  // ✅ send mail with resume
  await sendMail(
    email,
    "4 yrs React / SharePoint — exploring roles in your org",
    text
  );

  // ✅ mark sent
  await prisma.employee.update({
    where: { id },
    data: { emailSent: true },
  });

  return NextResponse.json({
    ok: true,
  });
}