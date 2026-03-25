import { prisma } from "../lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const jobs = await prisma.job.findMany({
    take: 5,
    orderBy: { id: "desc" },
  });

  const employees = await prisma.employee.findMany({
    take: 10,
    orderBy: { id: "desc" },
  });

  const messages = await prisma.message.findMany({
    take: 10,
    orderBy: { id: "desc" },
  });

  const queue = await prisma.emailQueue.findMany({
    take: 10,
    orderBy: { id: "desc" },
  });

  return (
    <DashboardClient
      initialJobs={jobs}
      initialEmployees={employees}
      initialMessages={messages}
      initialQueue={queue}
    />
  );
}