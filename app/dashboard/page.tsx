import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import AppShell from "@/app/components/AppShell";

function Card({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: 16,
        padding: 20,
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ color: "#9ca3af", fontSize: 14 }}>{subtitle}</div>
      )}
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "#111827",
          border: "1px solid #1f2937",
          borderRadius: 16,
          padding: 20,
          height: "100%",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
          {title}
        </div>
        <div style={{ color: "#9ca3af", lineHeight: 1.6 }}>{description}</div>
      </div>
    </Link>
  );
}

function StatusPill({ text }: { text: string }) {
  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: 999,
        background: "#1f2937",
        color: "#e5e7eb",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {text.replaceAll("_", " ")}
    </span>
  );
}

export default async function DashboardPage() {
  const user = await prisma.user.findFirst({
    include: {
      profile: true,
      roleProfiles: true,
      skills: true,
      companyPreferences: true,
      jobs: true,
      outreachLeads: {
        orderBy: {
          createdAt: "desc",
        },
      },
      applications: true,
    },
  });

  const profileName = user?.profile?.fullName ?? "Candidate";
  const preferredRole =
    user?.roleProfiles.find((role:any) => role.preferred)?.title ?? "Not set";

  const leads = user?.outreachLeads ?? [];
  const today = new Date();

  const followUpsDue = leads.filter(
    (lead:any) =>
      lead.nextFollowUp &&
      new Date(lead.nextFollowUp) <= today &&
   lead.status !== "referred" &&
lead.status !== "closed" &&
lead.status !== "replied"
  );

  const recentlyMessaged = leads
    .filter((lead:any) => lead.status === "messaged" && lead.lastContacted)
    .sort(
      (a:any, b:any) =>
        new Date(b.lastContacted || 0).getTime() -
        new Date(a.lastContacted || 0).getTime()
    )
    .slice(0, 5);

  const topPriorityLeads = leads
    .filter((lead:any) => lead.status !== "referred" && lead.status !== "closed")
    .sort((a:any, b:any) => b.priorityScore - a.priorityScore)
    .slice(0, 5);

  return (
    <AppShell
      title={`Welcome, ${profileName}`}
      subtitle="Your referral and job search workspace, centered around your profile and role targets."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card
          title="Role Profiles"
          value={user?.roleProfiles.length ?? 0}
          subtitle={`Preferred: ${preferredRole}`}
        />
        <Card
          title="Skills"
          value={user?.skills.length ?? 0}
          subtitle="Core profile skills"
        />
        <Card
          title="Target Companies"
          value={user?.companyPreferences.length ?? 0}
          subtitle="Prioritized company list"
        />
        <Card
          title="Jobs"
          value={user?.jobs.length ?? 0}
          subtitle="Tracked opportunities"
        />
        <Card
          title="Referral Leads"
          value={leads.length}
          subtitle="People to reach out to"
        />
        <Card
          title="Applications"
          value={user?.applications.length ?? 0}
          subtitle="Application tracker"
        />
        <Card
          title="Follow-Ups Due"
          value={followUpsDue.length}
          subtitle="Leads needing action now"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          marginBottom: 24,
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
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            Profile Snapshot
          </div>

          <div style={{ color: "#d1d5db", lineHeight: 1.8 }}>
            <div>
              <strong>Headline:</strong> {user?.profile?.headline ?? "Not set"}
            </div>
            <div>
              <strong>Experience:</strong>{" "}
              {user?.profile?.totalExperience ?? 0} years
            </div>
            <div>
              <strong>Preferred Role:</strong> {preferredRole}
            </div>
          </div>

          {user?.profile?.summary && (
            <p
              style={{
                color: "#9ca3af",
                marginTop: 16,
                lineHeight: 1.8,
              }}
            >
              {user.profile.summary}
            </p>
          )}
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            Next Build Targets
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {[
              "Lead follow-up actions",
              "AI job intro generation",
              "Job match scoring",
              "Editable profile fields",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "#1f2937",
                  borderRadius: 10,
                  padding: "10px 12px",
                  color: "#d1d5db",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          marginBottom: 24,
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 14,
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>Follow-Ups Due</div>
            <Link href="/leads" style={{ color: "#60a5fa", textDecoration: "none" }}>
              Open Leads
            </Link>
          </div>

          {followUpsDue.length === 0 ? (
            <div style={{ color: "#9ca3af" }}>No follow-ups due right now.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {followUpsDue.slice(0, 5).map((lead:any) => (
                <div
                  key={lead.id}
                  style={{
                    background: "#1f2937",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{lead.name}</div>
                  <div style={{ color: "#9ca3af", marginTop: 4 }}>
                    {lead.company} {lead.role ? `• ${lead.role}` : ""}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <StatusPill text={lead.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>
            Recently Messaged
          </div>

          {recentlyMessaged.length === 0 ? (
            <div style={{ color: "#9ca3af" }}>No recent outreach yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {recentlyMessaged.map((lead:any) => (
                <div
                  key={lead.id}
                  style={{
                    background: "#1f2937",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{lead.name}</div>
                  <div style={{ color: "#9ca3af", marginTop: 4 }}>
                    {lead.company}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13, color: "#cbd5e1" }}>
                    Last contacted:{" "}
                    {lead.lastContacted
                      ? new Date(lead.lastContacted).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>
            Top Priority Leads
          </div>

          {topPriorityLeads.length === 0 ? (
            <div style={{ color: "#9ca3af" }}>No leads yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {topPriorityLeads.map((lead:any) => (
                <div
                  key={lead.id}
                  style={{
                    background: "#1f2937",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{lead.name}</div>
                  <div style={{ color: "#9ca3af", marginTop: 4 }}>
                    {lead.company} • Priority {lead.priorityScore}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <StatusPill text={lead.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <QuickLink
          href="/profile"
          title="Profile"
          description="View and later edit your master candidate profile."
        />
        <QuickLink
          href="/roles"
          title="Roles"
          description="Manage role-specific positioning for jobs and outreach."
        />
        <QuickLink
          href="/jobs"
          title="Jobs"
          description="Track opportunities across Google, LinkedIn, Naukri, and company sites."
        />
        <QuickLink
          href="/leads"
          title="Leads"
          description="Manage referral targets, generated notes, and follow-ups."
        />
        <QuickLink
          href="/applications"
          title="Applications"
          description="Track what you have applied to and what is still pending."
        />
      </div>
    </AppShell>
  );
}