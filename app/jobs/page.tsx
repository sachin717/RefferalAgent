import AppShell from "@/app/components/AppShell";
import { prisma } from "../lib/prisma";


function StatusBadge({ status }: { status: string }) {
  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        background: "#1f2937",
        color: "#e5e7eb",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

export default async function JobsPage() {
  const user = await prisma.user.findFirst({
    include: {
      jobs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const jobs = user?.jobs ?? [];

  return (
    <AppShell
      title="Jobs"
      subtitle="Track discovered, shortlisted, and applied jobs across your target companies."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
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
          <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 10 }}>
            Total Jobs
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{jobs.length}</div>
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 10 }}>
            Shortlisted
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {jobs.filter((job:any) => job.status === "shortlisted").length}
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
          <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 10 }}>
            Applied
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {jobs.filter((job:any) => job.status === "applied").length}
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
          <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 10 }}>
            High Match
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {jobs.filter((job:any) => job.matchScore >= 70).length}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#111827",
          border: "1px solid #1f2937",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Add Job Manually
        </div>

        <form
          action="/api/jobs/create"
          method="POST"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <input
            name="title"
            placeholder="Job title"
            required
            style={inputStyle}
          />
          <input
            name="company"
            placeholder="Company"
            required
            style={inputStyle}
          />
          <input
            name="location"
            placeholder="Location"
            style={inputStyle}
          />
          <input
            name="source"
            placeholder="Source (Google, LinkedIn, Naukri)"
            style={inputStyle}
          />
          <input
            name="link"
            placeholder="Job link"
            style={inputStyle}
          />
          <input
            name="matchScore"
            placeholder="Match score (0-100)"
            type="number"
            min="0"
            max="100"
            style={inputStyle}
          />
          <select name="status" defaultValue="discovered" style={inputStyle}>
            <option value="discovered">Discovered</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="ready">Ready</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="closed">Closed</option>
          </select>

          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "12px 16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save Job
          </button>
        </form>
      </div>

      <div
        style={{
          background: "#111827",
          border: "1px solid #1f2937",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid #1f2937",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          Job List
        </div>

        {jobs.length === 0 ? (
          <div
            style={{
              padding: 20,
              color: "#9ca3af",
            }}
          >
            No jobs added yet.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#0f172a", textAlign: "left" }}>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Location</th>
                  <th style={thStyle}>Source</th>
                  <th style={thStyle}>Match</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Link</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job:any) => (
                  <tr
                    key={job.id}
                    style={{
                      borderTop: "1px solid #1f2937",
                    }}
                  >
                    <td style={tdStyle}>{job.title}</td>
                    <td style={tdStyle}>{job.company}</td>
                    <td style={tdStyle}>{job.location || "-"}</td>
                    <td style={tdStyle}>{job.source || "-"}</td>
                    <td style={tdStyle}>{job.matchScore}</td>
                    <td style={tdStyle}>
                      <StatusBadge status={job.status} />
                    </td>
                    <td style={tdStyle}>
                      {job.link ? (
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#60a5fa",
                            textDecoration: "none",
                          }}
                        >
                          Open
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#0f172a",
  color: "#e5e7eb",
  border: "1px solid #1f2937",
  borderRadius: 12,
  padding: "12px 14px",
  outline: "none",
};

const thStyle: React.CSSProperties = {
  padding: "14px 16px",
  color: "#94a3b8",
  fontSize: 13,
  fontWeight: 700,
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  color: "#e5e7eb",
  fontSize: 14,
};