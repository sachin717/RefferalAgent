"use client";

import { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Box,
  Button,
  Switch,
  Divider,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";

type Job = {
  id: string;
  title?: string | null;
  company?: string | null;
  link?: string | null;
};

type Employee = {
  id: string;
  name?: string | null;
  email?: string | null;
  company?: string | null;
  emailSent?: boolean | null;
};

type Message = {
  id: string;
  text?: string | null;
  employeeId?: string | null;
  jobTitle?: string | null;
  company?: string | null;
};

type QueueItem = {
  id: string;
  to?: string | null;
  text?: string | null;
  status?: string | null;
  company?: string | null;
};

type Props = {
  initialJobs: Job[];
  initialEmployees: Employee[];
  initialMessages: Message[];
  initialQueue: QueueItem[];
};

type RowState = {
  generate: boolean;
  send: boolean;
};

export default function DashboardClient({
  initialJobs,
  initialEmployees,
  initialMessages,
  initialQueue,
}: Props) {
  const [jobs] = useState<Job[]>(initialJobs);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [queue] = useState<QueueItem[]>(initialQueue);
  const [automation, setAutomation] = useState(false);
const [drafts, setDrafts] = useState<
  Record<
    string,
    {
      subject: string;
      keywords: string;
      body: string;
      generated: boolean;
    }
  >
>({});
 const [manualEmails, setManualEmails] = useState<any>({});
  const [rowStates, setRowStates] = useState<Record<string, RowState>>({});
  const [pageNotice, setPageNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [selectedMessage, setSelectedMessage] = useState<{
    employeeId: string;
    employeeName: string;
    company: string;
    body: string;
  } | null>(null);

  const employeeState = useMemo(() => {
    return (employeeId: string) => {
      return rowStates[employeeId] || { generate: false, send: false };
    };
  }, [rowStates]);

  const updateRowState = (
    employeeId: string,
    type: "generate" | "send",
    value: boolean
  ) => {
    setRowStates((prev) => ({
      ...prev,
      [employeeId]: {
        ...(prev[employeeId] || { generate: false, send: false }),
        [type]: value,
      },
    }));
  };

const handleGenerateEmail = async (employee: Employee) => {
  const employeeId = employee.id;

  try {
    updateRowState(employeeId, "generate", true);
    setPageNotice(null);

    const res = await fetch("/api/generateMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: employeeId }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || "Failed to generate email");
    }

    if (data?.message) {
      setMessages((prev) => [data.message, ...prev].slice(0, 10));
    }

    setDrafts((prev) => ({
      ...prev,
      [employeeId]: {
        subject: `Exploring opportunities at ${employee.company || "your company"}`,
        keywords: "",
        body: data?.message?.text || data?.preview || "",
        generated: true,
      },
    }));

    setPageNotice({
      type: "success",
      text: `Message generated for ${employee.name || "employee"}`,
    });
  } catch (error) {
    setPageNotice({
      type: "error",
      text: error instanceof Error ? error.message : "Failed to generate email",
    });
  } finally {
    updateRowState(employeeId, "generate", false);
  }
};

const handleSendReferral = async (employee: Employee) => {
  const employeeId = employee.id;
  const draft = drafts[employeeId];

  try {
    updateRowState(employeeId, "send", true);
    setPageNotice(null);

    const res = await fetch("/api/sendManual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({
  id: employeeId,
  subject: draft?.subject || `Exploring opportunities at ${employee.company || "your company"}`,
  text: draft?.body || "",
  manualEmail: manualEmails[employeeId] || "",
}),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data?.error) {
      throw new Error(data?.error || "Failed to send referral");
    }

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, emailSent: true } : emp
      )
    );

    setPageNotice({
      type: "success",
      text: `Referral sent to ${employee.name || "employee"}`,
    });
  } catch (error) {
    setPageNotice({
      type: "error",
      text: error instanceof Error ? error.message : "Failed to send referral",
    });
  } finally {
    updateRowState(employeeId, "send", false);
  }
};

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0b0f14" }}>
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            py: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Referral Dashboard
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography>Automation</Typography>
            <Switch
              checked={automation}
              onChange={(e) => setAutomation(e.target.checked)}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {pageNotice && (
          <Alert severity={pageNotice.type} sx={{ mb: 3 }}>
            {pageNotice.text}
          </Alert>
        )}

        {selectedMessage && (
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              bgcolor: "#111827",
              color: "#fff",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Latest Generated Email Preview
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              For: {selectedMessage.employeeName}
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              Company: {selectedMessage.company}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              {selectedMessage.body}
            </Typography>
          </Paper>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Paper sx={{ p: 3, borderRadius: 3, minHeight: 320 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Jobs
            </Typography>
            <Chip label={`${jobs.length} recent jobs`} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 2 }} />

            {jobs.length === 0 ? (
              <Typography color="text.secondary">No jobs found</Typography>
            ) : (
              <Stack spacing={1.5}>
                {jobs.map((job) => (
                  <Box
                    key={job.id}
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      bgcolor: "#fafafa",
                    }}
                  >
                    <Typography fontWeight={700}>
                      {job.title || "Untitled Job"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {job.company || "No company"}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, minHeight: 320 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Employees / Referrers
            </Typography>
            <Chip label={`${employees.length} recent employees`} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 2 }} />

            {employees.length === 0 ? (
              <Typography color="text.secondary">No employees found</Typography>
            ) : (
              <Stack spacing={1.5}>
                {employees.map((emp) => {
                  const state = employeeState(emp.id);

                  return (
                    <Box
                      key={emp.id}
                      sx={{
                        p: 2,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        bgcolor: "#fafafa",
                      }}
                    >
                      <Typography fontWeight={700}>
                        {emp.name || "No name"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {emp.email || "No email"}
                      </Typography>
                      <input
  placeholder="Enter email manually"
  value={manualEmails[emp.id] || ""}
  onChange={(e) =>
    setManualEmails((prev:any) => ({
      ...prev,
      [emp.id]: e.target.value,
    }))
  }
/>

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {emp.company || "No company"}
                      </Typography>

                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Status: {emp.emailSent ? "Email sent" : "Pending"}
                      </Typography>
{drafts[emp.id]?.generated && (
  <Box
    sx={{
      mt: 2,
      p: 2,
      borderRadius: 2,
      bgcolor: "#f8fafc",
      border: "1px solid #dbe2ea",
    }}
  >
    <Typography fontWeight={700} sx={{ mb: 1.5 }}>
      Draft Email
    </Typography>

    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Subject
      </Typography>
      <input
        value={drafts[emp.id].subject}
        onChange={(e) =>
          setDrafts((prev) => ({
            ...prev,
            [emp.id]: {
              ...prev[emp.id],
              subject: e.target.value,
            },
          }))
        }
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          fontSize: "14px",
        }}
      />
    </Box>

    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Keywords / Notes for Regeneration
      </Typography>
      <input
        placeholder="Example: mention React, SharePoint, 4 years experience"
        value={drafts[emp.id].keywords}
        onChange={(e) =>
          setDrafts((prev) => ({
            ...prev,
            [emp.id]: {
              ...prev[emp.id],
              keywords: e.target.value,
            },
          }))
        }
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          fontSize: "14px",
        }}
      />
    </Box>

    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Message
      </Typography>
      <textarea
        value={drafts[emp.id].body}
        onChange={(e) =>
          setDrafts((prev) => ({
            ...prev,
            [emp.id]: {
              ...prev[emp.id],
              body: e.target.value,
            },
          }))
        }
        rows={10}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          fontSize: "14px",
          resize: "vertical",
          fontFamily: "inherit",
          lineHeight: 1.6,
        }}
      />
    </Box>

    <Stack direction="row" spacing={1.5} flexWrap="wrap">
      <Button
        size="small"
        variant="outlined"
        onClick={() => handleGenerateEmail(emp)}
      >
        Regenerate
      </Button>

      <Button
        size="small"
        variant="contained"
        color="primary"
        disabled={employeeState(emp.id).send}
        onClick={() => handleSendReferral(emp)}
      >
        {employeeState(emp.id).send ? "Sending..." : "Send Referral"}
      </Button>
    </Stack>
  </Box>
)}
                      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }} flexWrap="wrap">
                        <Button
                          size="small"
                          variant="contained"
                          disabled={state.generate}
                          onClick={() => handleGenerateEmail(emp)}
                          sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}
                        >
                          {state.generate ? (
                            <>
                              <CircularProgress size={16} sx={{ mr: 1, color: "#fff" }} />
                              Generating...
                            </>
                          ) : (
                            "Generate Email"
                          )}
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          disabled={state.send}
                          onClick={() => handleSendReferral(emp)}
                        >
                          {state.send ? (
                            <>
                              <CircularProgress size={16} sx={{ mr: 1, color: "#fff" }} />
                              Sending...
                            </>
                          ) : (
                            "Send Referral"
                          )}
                        </Button>
                      </Stack>
                    </Box>
                  );

                })}
              </Stack>
            )}
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, minHeight: 320 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Generated Messages
            </Typography>
            <Chip label={`${messages.length} saved messages`} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 2 }} />

            {messages.length === 0 ? (
              <Typography color="text.secondary">No generated messages found</Typography>
            ) : (
              <Stack spacing={1.5}>
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      bgcolor: "#fafafa",
                    }}
                  >
                    <Typography fontWeight={700}>
                      {msg.company || "No company"} - {msg.jobTitle || "No job title"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {msg.text || "No message text"}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, minHeight: 320 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Referral Queue
            </Typography>
            <Chip label={`${queue.length} queued emails`} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 2 }} />

            {queue.length === 0 ? (
              <Typography color="text.secondary">No queued emails found</Typography>
            ) : (
              <Stack spacing={1.5}>
                {queue.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      bgcolor: "#fafafa",
                    }}
                  >
                    <Typography fontWeight={700}>
                      {item.to || "No recipient"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Status: {item.status || "pending"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.text || "No text"}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}