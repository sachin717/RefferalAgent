
// import "../globals.css"
import { prisma } from "../lib/prisma";
import AppShell from "@/app/components/AppShell";
function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function RolesPage() {
  const user = await prisma.user.findFirst({
    include: {
      roleProfiles: {
        orderBy: [
          { preferred: "desc" },
          { createdAt: "asc" },
        ],
      },
    },
  });

  if (!user) {
    return (
      <div style={{ padding: 24, color: "white" }}>
        <h1>Roles</h1>
        <p>No user found.</p>
      </div>
    );
  }

  return (
      <AppShell
    title="Role Profiles"
    subtitle="These profiles power job matching, referral messaging, and application tailoring."
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
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
              Role Profiles
            </h1>
            <p style={{ color: "#9ca3af", fontSize: 16 }}>
              These profiles will power job matching, referral messaging, and application tailoring.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 20,
          }}
        >
          {user.roleProfiles.map((role:any) => {
            const keySkills = parseJsonArray(role.keySkills);
            const bestProjects = parseJsonArray(role.bestProjects);
            const targetCompanies = parseJsonArray(role.targetCompanies);
            const targetLocations = parseJsonArray(role.targetLocations);

            return (
              <div
                key={role.id}
                style={{
                  background: "#111827",
                  border: role.preferred
                    ? "1px solid #3b82f6"
                    : "1px solid #1f2937",
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: role.preferred
                    ? "0 0 0 1px rgba(59,130,246,0.15)"
                    : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        marginBottom: 8,
                        lineHeight: 1.3,
                      }}
                    >
                      {role.title}
                    </h2>

                    {role.shortHeadline && (
                      <p
                        style={{
                          color: "#93c5fd",
                          fontSize: 15,
                          lineHeight: 1.5,
                        }}
                      >
                        {role.shortHeadline}
                      </p>
                    )}
                  </div>

                  {role.preferred && (
                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: "#1d4ed8",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Preferred
                    </span>
                  )}
                </div>

                {role.summary && (
                  <p
                    style={{
                      color: "#d1d5db",
                      lineHeight: 1.7,
                      marginBottom: 18,
                    }}
                  >
                    {role.summary}
                  </p>
                )}

                {role.outreachTone && (
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#9ca3af",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      Outreach Tone
                    </div>
                    <span
                      style={{
                        padding: "8px 12px",
                        background: "#1f2937",
                        borderRadius: 999,
                        fontSize: 14,
                        color: "#e5e7eb",
                      }}
                    >
                      {role.outreachTone}
                    </span>
                  </div>
                )}

                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#9ca3af",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      Key Skills
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {keySkills.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            padding: "8px 12px",
                            background: "#172554",
                            color: "#dbeafe",
                            borderRadius: 999,
                            fontSize: 13,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#9ca3af",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      Best Projects
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {bestProjects.map((project) => (
                        <span
                          key={project}
                          style={{
                            padding: "8px 12px",
                            background: "#1f2937",
                            color: "#e5e7eb",
                            borderRadius: 999,
                            fontSize: 13,
                          }}
                        >
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#9ca3af",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      Target Companies
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {targetCompanies.map((company) => (
                        <span
                          key={company}
                          style={{
                            padding: "8px 12px",
                            background: "#1f2937",
                            color: "#e5e7eb",
                            borderRadius: 999,
                            fontSize: 13,
                          }}
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#9ca3af",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      Target Locations
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {targetLocations.map((location) => (
                        <span
                          key={location}
                          style={{
                            padding: "8px 12px",
                            background: "#1f2937",
                            color: "#e5e7eb",
                            borderRadius: 999,
                            fontSize: 13,
                          }}
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </AppShell>
  );
}