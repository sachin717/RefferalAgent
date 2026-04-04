import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/roles", label: "Roles" },
  { href: "/jobs", label: "Jobs" },
  { href: "/leads", label: "Leads" },
  { href: "/applications", label: "Applications" },
];

export default function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1220",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid #1f2937",
          background: "#0f172a",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#f8fafc",
              }}
            >
              Referral Copilot
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#94a3b8",
                marginTop: 4,
              }}
            >
              Profile-driven job search and referral workflow
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "#cbd5e1",
                  background: "#111827",
                  border: "1px solid #1f2937",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: 24,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                color: "#94a3b8",
                fontSize: 16,
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}