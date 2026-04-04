import Link from "next/link";
import { prisma } from "../lib/prisma";

import AppShell from "@/app/components/AppShell";
export default async function ProfilePage() {
  const user = await prisma.user.findFirst({
    include: {
      profile: true,
      skills: {
        orderBy: {
          priority: "desc",
        },
      },
      projects: true,
      companyPreferences: {
        orderBy: {
          priority: "asc",
        },
      },
    },
  });

  if (!user || !user.profile) {
    return (
      <div style={{ padding: 24, color: "white" }}>
        <h1>Profile</h1>
        <p>No profile found.</p>
      </div>
    );
  }

  const profile = user.profile;

  let preferredLocations: string[] = [];
  try {
    preferredLocations = profile.preferredLocations
      ? JSON.parse(profile.preferredLocations)
      : [];
  } catch {
    preferredLocations = [];
  }

    return (
  <AppShell
    title="My Profile"
    subtitle="Your core candidate profile powering roles, outreach, and applications."
  >
     <div
      style={{
        padding: 24,
        background: "#0b1220",
        minHeight: "100vh",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gap: 20,
        }}
      >
        <div
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            {profile.fullName}
          </h1>

          <p style={{ fontSize: 18, color: "#93c5fd", marginBottom: 12 }}>
            {profile.headline}
          </p>

          <p style={{ color: "#9ca3af", marginBottom: 8 }}>
            Experience: {profile.totalExperience ?? 0} years
          </p>

          <p style={{ lineHeight: 1.7, color: "#d1d5db", marginBottom: 16 }}>
            {profile.summary}
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {profile.linkedinUrl && (
              <Link
                href={profile.linkedinUrl}
                target="_blank"
                style={{
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                LinkedIn
              </Link>
            )}

            {profile.githubUrl && (
              <Link
                href={profile.githubUrl}
                target="_blank"
                style={{
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                GitHub
              </Link>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
              Preferred Locations
            </h2>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {preferredLocations.map((location) => (
                <span
                  key={location}
                  style={{
                    padding: "8px 12px",
                    background: "#1f2937",
                    borderRadius: 999,
                    fontSize: 14,
                  }}
                >
                  {location}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
              Target Companies
            </h2>

            <div style={{ display: "grid", gap: 10 }}>
              {user.companyPreferences.map((company:any) => (
                <div
                  key={company.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#1f2937",
                    padding: "10px 12px",
                    borderRadius: 10,
                  }}
                >
                  <span>{company.name}</span>
                  <span style={{ color: "#9ca3af" }}>
                    Priority {company.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
            Skills
          </h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {user.skills.map((skill:any) => (
              <span
                key={skill.id}
                style={{
                  padding: "8px 12px",
                  background: "#172554",
                  color: "#dbeafe",
                  borderRadius: 999,
                  fontSize: 14,
                }}
              >
                {skill.name}
                {skill.years ? ` • ${skill.years} yrs` : ""}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
            Projects
          </h2>

          <div style={{ display: "grid", gap: 12 }}>
            {user.projects.map((project:any) => (
              <div
                key={project.id}
                style={{
                  background: "#1f2937",
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div style={{ fontWeight: 600 }}>{project.title}</div>
                {project.description && (
                  <div style={{ color: "#9ca3af", marginTop: 6 }}>
                    {project.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);
   

}