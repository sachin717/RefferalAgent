import React from "react";
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
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default async function ApplicationsPage() {
  const user = await prisma.user.findFirst({
    include: {
      jobs: {
        orderBy: {
          createdAt: "desc",
        },
      },
      applications: {
        include: {
          job: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const jobs = user?.jobs ?? [];
  const applications = user?.applications ?? [];

  return (
    <AppShell
      title="Applications"
      subtitle="Track job applications, linked jobs, notes, and status progression."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <SummaryCard title="Total Applications" value={applications.length} />
        <SummaryCard
          title="Ready"
          value={applications.filter((item:any) => item.status === "ready").length}
        />
        <SummaryCard
          title="Applied"
          value={applications.filter((item:any) => item.status === "applied").length}
        />
        <SummaryCard
          title="Interview"
          value={applications.filter((item:any) => item.status === "interview").length}
        />
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
          Create Application
        </div>

        <form
          action="/api/applications/create"
          method="POST"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <select name="jobId" required style={inputStyle}>
            <option value="">Select Job</option>
            {jobs.map((job:any) => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.company}
              </option>
            ))}
          </select>

          <select name="status" defaultValue="ready" style={inputStyle}>
            <option value="ready">Ready</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>

          <input
            name="resumeUsed"
            placeholder="Resume used"
            style={inputStyle}
          />

          <input
            name="introNote"
            placeholder="Short intro note"
            style={inputStyle}
          />

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
            Save Application
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
          Applications List
        </div>

        {applications.length === 0 ? (
          <div
            style={{
              padding: 20,
              color: "#9ca3af",
            }}
          >
            No applications added yet.
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
                  <th style={thStyle}>Job</th>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Resume</th>
                  <th style={thStyle}>Intro Note</th>
                  <th style={thStyle}>Applied At</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application:any) => (
                  <tr
                    key={application.id}
                    style={{
                      borderTop: "1px solid #1f2937",
                    }}
                  >
                    <td style={tdStyle}>{application.job.title}</td>
                    <td style={tdStyle}>{application.job.company}</td>
                    <td style={tdStyle}>
                      <StatusBadge status={application.status} />
                    </td>
                    <td style={tdStyle}>{application.resumeUsed || "-"}</td>
                    <td style={tdStyle}>{application.introNote || "-"}</td>
                    <td style={tdStyle}>
                      {application.appliedAt
                        ? new Date(application.appliedAt).toLocaleDateString()
                        : "-"}
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

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
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
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
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