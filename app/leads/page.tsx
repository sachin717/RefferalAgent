import React from "react";
import AppShell from "@/app/components/AppShell";
import { prisma } from "@/app/lib/prisma";

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

export default async function LeadsPage() {
  const user = await prisma.user.findFirst({
    include: {
      outreachLeads: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const leads = user?.outreachLeads ?? [];

  return (
    <AppShell
      title="Referral Leads"
      subtitle="Track people to contact for referrals, networking, and follow-ups."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <SummaryCard title="Total Leads" value={leads.length} />
        <SummaryCard
          title="New"
          value={leads.filter((lead:any) => lead.status === "new").length}
        />
        <SummaryCard
          title="Messaged"
          value={leads.filter((lead:any) => lead.status === "messaged").length}
        />
        <SummaryCard
          title="Replied"
          value={leads.filter((lead:any) => lead.status === "replied").length}
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
          Add Lead Manually
        </div>

        <form
          action="/api/leads/create"
          method="POST"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <input name="name" placeholder="Name" required style={inputStyle} />
          <input
            name="company"
            placeholder="Company"
            required
            style={inputStyle}
          />
          <input name="role" placeholder="Role" style={inputStyle} />
          <input
            name="linkedinUrl"
            placeholder="LinkedIn URL"
            style={inputStyle}
          />
          <input
            name="source"
            placeholder="Source (LinkedIn / Manual / Google Search)"
            style={inputStyle}
          />
          <input
            name="priorityScore"
            placeholder="Priority Score (0-100)"
            type="number"
            min="0"
            max="100"
            style={inputStyle}
          />
          <select name="status" defaultValue="new" style={inputStyle}>
            <option value="new">New</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="invite_sent">Invite Sent</option>
            <option value="connected">Connected</option>
            <option value="messaged">Messaged</option>
            <option value="replied">Replied</option>
            <option value="referred">Referred</option>
            <option value="closed">Closed</option>
          </select>
          <input
            name="commonGround"
            placeholder="Common ground"
            style={inputStyle}
          />
          <input
            name="notes"
            placeholder="Notes"
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
            Save Lead
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
          Leads List
        </div>

        {leads.length === 0 ? (
          <div
            style={{
              padding: 20,
              color: "#9ca3af",
            }}
          >
            No leads added yet.
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
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Source</th>
                  <th style={thStyle}>Priority</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>LinkedIn</th>
                  <th style={thStyle}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead:any) => (
                  <tr
                    key={lead.id}
                    style={{
                      borderTop: "1px solid #1f2937",
                    }}
                  >
                    <td style={tdStyle}>{lead.name}</td>
                    <td style={tdStyle}>{lead.company}</td>
                    <td style={tdStyle}>{lead.role || "-"}</td>
                    <td style={tdStyle}>{lead.source || "-"}</td>
                    <td style={tdStyle}>{lead.priorityScore}</td>
                    <td style={tdStyle}>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td style={tdStyle}>
                      {lead.linkedinUrl ? (
                        <a
                          href={lead.linkedinUrl}
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
                    <td style={tdStyle}>{lead.notes || lead.commonGround || "-"}</td>
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