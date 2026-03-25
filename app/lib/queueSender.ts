import { sendMail } from "./mailre";
import { prisma } from "./prisma";


export async function processQueue() {
  const items = await prisma.emailQueue.findMany({
    where: {
      status: "pending",
    },
    take: 2,
  });

  for (const item of items) {
    await sendMail(
      item.to,
      "Referral request",
      item.text
    );

    await prisma.emailQueue.update({
      where: { id: item.id },
      data: {
        status: "sent",
      },
    });
  }
}