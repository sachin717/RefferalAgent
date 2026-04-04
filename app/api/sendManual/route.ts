import { findEmailApollo } from "@/app/lib/apollo";
import { sendMail } from "@/app/lib/mailre";
import { generateMessage } from "@/app/lib/messageAI";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
const { id, subject, text, manualEmail } = await req.json();

const emp = await prisma.employee.findUnique({ where: { id } });

let email = emp?.email || manualEmail || null;

if (!email) {
  email = await findEmailApollo(emp.name, emp.company);

  if (email) {
    await prisma.employee.update({
      where: { id },
      data: { email },
    });
  }
}

if (!email) {
  return NextResponse.json({ error: "no email" }, { status: 400 });
}

await sendMail(
  email,
  subject || `Exploring opportunities at ${emp.company}`,
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