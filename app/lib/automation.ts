import { prisma } from "./prisma";

import { generateMessage } from "./messageAI";
import { sendMail } from "./mailre";
import { companies } from "./companies";
import { findEmailApollo } from "./apollo";

export async function runAutomation() {
    
    const settings =
    await prisma.settings.findFirst();
  
  if (!settings?.automation) {
    console.log("Automation paused");
    return;
  }

 for (const company of companies) {
  const job = await prisma.job.findFirst({
    where: { company },
  });

  if (!job) continue;

  const employees =
    await prisma.employee.findMany({
      where: { company },
      take: 3,
    });


  for (const e of employees) {
    let email = e.email;

if (!email) {
  // email = await findEmailApollo(
  //   e.name,
  //   e.company
  // );

  if (email) {
    await prisma.employee.update({
      where: { id: e.id },
      data: { email },
    });
  }
}

if (!email) continue;
    const text = await generateMessage(
      e.name,
      job.title
    );

    const to = "test@email.com";

await prisma.emailQueue.create({
  data: {
    to: email,
    text,
    company: e.company,
  },
});

    await prisma.emailLog.create({
      data: {
        to,
        subject: job.title,
        status: "sent",
      },
    });
  }
}
}
