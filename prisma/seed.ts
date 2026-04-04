import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "sachin@example.com" },
    update: {},
    create: {
      email: "sachin@example.com",
    },
  });

  await prisma.candidateProfile.upsert({
    where: { userId: user.id },
    update: {
      fullName: "Sachin Gagneja",
      headline: "Software Engineer | React.js, Next.js, SharePoint, AI Integrations",
      totalExperience: 4,
      summary:
        "Software professional with 4 years of experience building and improving user-focused business applications. Strong hands-on expertise in React.js, Next.js, SharePoint, REST APIs, Azure, and AI integrations. Delivered solutions such as ticketing, asset management, performance management, and AI-driven tools with a focus on usability, performance, and business impact.",
      linkedinUrl: "https://www.linkedin.com/in/sachin-gagneja-3b7084247/",
      githubUrl: "https://github.com/sachin717",
      preferredLocations: JSON.stringify([
        "Bengaluru",
        "Pune",
        "Gurugram",
        "United States",
        "Dubai",
        "Germany",
      ]),
    },
    create: {
      userId: user.id,
      fullName: "Sachin Gagneja",
      headline: "Software Engineer | React.js, Next.js, SharePoint, AI Integrations",
      totalExperience: 4,
      summary:
        "Software professional with 4 years of experience building and improving user-focused business applications. Strong hands-on expertise in React.js, Next.js, SharePoint, REST APIs, Azure, and AI integrations. Delivered solutions such as ticketing, asset management, performance management, and AI-driven tools with a focus on usability, performance, and business impact.",
      linkedinUrl: "https://www.linkedin.com/in/sachin-gagneja-3b7084247/",
      githubUrl: "https://github.com/sachin717",
      preferredLocations: JSON.stringify([
        "Bengaluru",
        "Pune",
        "Gurugram",
        "United States",
        "Dubai",
        "Germany",
      ]),
    },
  });

  await prisma.roleProfile.deleteMany({
    where: { userId: user.id },
  });

  await prisma.roleProfile.createMany({
    data: [
      {
        userId: user.id,
        title: "Software Development Engineer",
        shortHeadline:
          "Software Development Engineer | React.js, Next.js, APIs, AI Integrations",
        summary:
          "Software Engineer with 4 years of experience building user-focused applications and business platforms. Hands-on expertise in React.js, Next.js, REST APIs, Azure, and AI integrations. Built solutions such as ticketing systems, asset management tools, performance platforms, and AI-driven applications with a strong focus on usability, scalability, and product impact.",
        keySkills: JSON.stringify([
          "React.js",
          "Next.js",
          "REST APIs",
          "Azure",
          "AI Integrations",
          "Cloud Platforms",
        ]),
        bestProjects: JSON.stringify([
          "Ticketing Tool",
          "Asset Management",
          "AI Agents",
        ]),
        targetCompanies: JSON.stringify([
          "Google",
          "Microsoft",
          "Amazon",
          "Other MNCs",
        ]),
        targetLocations: JSON.stringify([
          "Bengaluru",
          "Pune",
          "Gurugram",
          "United States",
          "Dubai",
          "Germany",
        ]),
        outreachTone: "professional_warm",
        preferred: true,
      },
      {
        userId: user.id,
        title: "Frontend / Full Stack Engineer",
        shortHeadline:
          "Frontend / Full Stack Engineer | React.js, Next.js, UI, APIs",
        summary:
          "Frontend and Full Stack Engineer with 4 years of experience delivering modern, user-centric applications. Strong background in React.js, Next.js, UI design, REST APIs, and cloud-backed application workflows.",
        keySkills: JSON.stringify([
          "React.js",
          "Next.js",
          "UI Design",
          "REST APIs",
          "Azure",
          "Cloud Platforms",
        ]),
        bestProjects: JSON.stringify([
          "Ticketing Tool",
          "Performance Management",
          "AI Agents",
        ]),
        targetCompanies: JSON.stringify([
          "Google",
          "Microsoft",
          "Amazon",
          "Other MNCs",
        ]),
        targetLocations: JSON.stringify([
          "Bengaluru",
          "Pune",
          "Gurugram",
          "United States",
          "Dubai",
          "Germany",
        ]),
        outreachTone: "confident_human",
        preferred: false,
      },
      {
        userId: user.id,
        title: "SharePoint Developer / Enterprise Applications Engineer",
        shortHeadline:
          "SharePoint Developer | Enterprise Tools, Process Automation, Business Applications",
        summary:
          "Enterprise application developer with 4 years of experience building internal business solutions and workflow-driven platforms. Strong experience in SharePoint, process-oriented application design, UI improvement, REST APIs, Azure, and integrations.",
        keySkills: JSON.stringify([
          "SharePoint",
          "React.js",
          "REST APIs",
          "Azure",
          "Business Applications",
          "AI Integrations",
        ]),
        bestProjects: JSON.stringify([
          "Ticketing Tool",
          "Asset Management",
          "Performance Management",
        ]),
        targetCompanies: JSON.stringify([
          "Microsoft",
          "Other MNCs",
          "Amazon",
          "Google",
        ]),
        targetLocations: JSON.stringify([
          "Bengaluru",
          "Pune",
          "Gurugram",
          "Dubai",
          "Germany",
        ]),
        outreachTone: "professional_direct",
        preferred: false,
      },
      {
        userId: user.id,
        title: "Associate Tech Lead / Project Manager",
        shortHeadline:
          "Associate Tech Lead | Delivery, Product Thinking, Team Coordination",
        summary:
          "Technology professional with 4 years of experience delivering user-focused software solutions while contributing across engineering, coordination, and continuous improvement.",
        keySkills: JSON.stringify([
          "Project Delivery",
          "React.js",
          "Next.js",
          "SharePoint",
          "Azure",
          "AI Integrations",
        ]),
        bestProjects: JSON.stringify([
          "Ticketing Tool",
          "Asset Management",
          "Performance Management",
          "AI Agents",
        ]),
        targetCompanies: JSON.stringify([
          "Google",
          "Microsoft",
          "Amazon",
          "Other MNCs",
        ]),
        targetLocations: JSON.stringify([
          "Bengaluru",
          "Pune",
          "Gurugram",
          "United States",
          "Dubai",
          "Germany",
        ]),
        outreachTone: "leadership_balanced",
        preferred: false,
      },
    ],
  });

  await prisma.skill.deleteMany({
    where: { userId: user.id },
  });

  await prisma.skill.createMany({
    data: [
      { userId: user.id, name: "React.js", priority: 10, years: 4 },
      { userId: user.id, name: "Next.js", priority: 9, years: 3 },
      { userId: user.id, name: "SharePoint", priority: 9, years: 4 },
      { userId: user.id, name: "AI Integrations", priority: 8, years: 2 },
      { userId: user.id, name: "REST APIs", priority: 8, years: 4 },
      { userId: user.id, name: "Azure", priority: 7, years: 2 },
      { userId: user.id, name: "Cloud Platforms", priority: 6, years: 2 },
    ],
  });

  await prisma.candidateProject.deleteMany({
    where: { userId: user.id },
  });

  await prisma.candidateProject.createMany({
    data: [
      { userId: user.id, title: "Ticketing Tool" },
      { userId: user.id, title: "Asset Management" },
      { userId: user.id, title: "Performance Management" },
      { userId: user.id, title: "AI Agents" },
    ],
  });

  await prisma.companyPreference.deleteMany({
    where: { userId: user.id },
  });

  await prisma.companyPreference.createMany({
    data: [
      { userId: user.id, name: "Google", priority: 1 },
      { userId: user.id, name: "Microsoft", priority: 2 },
      { userId: user.id, name: "Amazon", priority: 3 },
      { userId: user.id, name: "Other MNCs", priority: 4 },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });