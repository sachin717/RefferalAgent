import { scrapeGoogleJobs } from "@/app/lib/jobScraper";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  const jobs = await scrapeGoogleJobs();

  for (const job of jobs) {
    await prisma.job.create({
      data: {
        title: job.title,
        company:"Google",
        link: job.link,
      },
    });
  }

  return NextResponse.json({
    success: true,
    count: jobs.length,
  });
}