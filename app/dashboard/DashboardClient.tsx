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
import Grid from "@mui/material/Grid";

type Job = {
  id: string | number;
  title?: string | null;
  company?: string | null;
  location?: string | null;
};

type Employee = {
  id: string | number;
  name?: string | null;
  email?: string | null;
};

type Message = {
  id: string | number;
  subject?: string | null;
  body?: string | null;
};

type QueueItem = {
  id: string | number;
  to?: string | null;
  email?: string | null;
  subject?: string | null;
  status?: string | null;
};

type Props = {
  initialJobs: Job[];
  initialEmployees: Employee[];
  initialMessages: Message[];
  initialQueue: QueueItem[];
};

type ActionState = {
  loading: boolean;
  error: string;
  success: string;
};

export default function DashboardClient({
  initialJobs,
  initialEmployees,
  initialMessages,
  initialQueue,
}: Props) {
  const [jobs] = useState<Job[]>(initialJobs);
  const [employees] = useState<Employee[]>(initialEmployees);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);

  const [automation, setAutomation] = useState(false);

  const [bulkGenerateState, setBulkGenerateState] = useState<ActionState>({
    loading: false,
    error: "",
    success: "",
  });

  const [rowStates, setRowStates] = useState<
    Record<string, { generate: boolean; send: boolean }>
  >({});

  const [selectedMessage, setSelectedMessage] = useState<{
    employeeId: string;
    employeeName: string;
    subject: string;
    body: string;
  } | null>(null);

  const [pageNotice, setPageNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const employeeState = useMemo(() => {
    return (employeeId: string | number) => {
      const key = String(employeeId);
      return rowStates[key] || { generate: false, send: false };
    };
  }, [rowStates]);

  const updateRowState = (
    employeeId: string | number,
    type: "generate" | "send",
    value: boolean
  ) => {
    const key = String(employeeId);
    setRowStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value,
      },
    }));
  };

  const handleGenerateAllEmails = async () => {
    try {
      setBulkGenerateState({
        loading: true,
        error: "",
        success: "",
      });
      setPageNotice(null);

      const res = await fetch("/api/generate-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate emails.");
      }

      if (Array.isArray(data?.messages) && data.messages.length > 0) {
        setMessages((prev) => {
          const merged = [...data.messages, ...prev];
          const unique = merged.filter(
            (item, index, arr) =>
              index === arr.findIndex((x) => String(x.id) === String(item.id))
          );
          return unique.slice(0, 10);
        });
      }

      setBulkGenerateState({
        loading: false,
        error: "",
        success: data?.message || "Emails generated successfully.",
      });
    } catch (error) {
      setBulkGenerateState({
        loading: false,
        error: error instanceof Error ? error.message : "Something went wrong.",
        success: "",
      });
    }
  };

  const handleGenerateEmail = async (employee: Employee) => {
    const employeeId = String(employee.id);

    try {
      updateRowState(employeeId, "generate", true);
      setPageNotice(null);

      const res = await fetch(`/api/generate-email?employeeId=${employeeId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate email.");
      }

      if (data?.message) {
        setMessages((prev) => {
          const merged = [data.message, ...prev];
          const unique = merged.filter(
            (item, index, arr) =>
              index === arr.findIndex((x) => String(x.id) === String(item.id))
          );
          return unique.slice(0, 10);
        });
      }

      setSelectedMessage({
        employeeId,
        employeeName: employee.name || "Unknown Employee",
        subject:
          data?.message?.subject || data?.subject || "Referral request",
        body: data?.message?.body || data?.body || "No message returned.",
      });

      setPageNotice({
        type: "success",
        text: `Email generated for ${employee.name || "employee"}.`,
      });
    } catch (error) {
      setPageNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to generate email.",
      });
    } finally {
      updateRowState(employeeId, "generate", false);
    }
  };

  const handleSendReferral = async (employee: Employee) => {
    const employeeId = String(employee.id);

    try {
      updateRowState(employeeId, "send", true);
      setPageNotice(null);

      const res = await fetch(`/api/send-referral?employeeId=${employeeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send referral.");
      }

      if (data?.queueItem) {
        setQueue((prev) => {
          const merged = [data.queueItem, ...prev];
          const unique = merged.filter(
            (item, index, arr) =>
              index === arr.findIndex((x) => String(x.id) === String(item.id))
          );
          return unique.slice(0, 10);
        });
      }

      setPageNotice({
        type: "success",
        text: data?.message || `Referral sent to ${employee.name || "employee"}.`,
      });
    } catch (error) {
      setPageNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to send referral.",
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

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Automation</Typography>
              <Switch
                checked={automation}
                onChange={(e) => setAutomation(e.target.checked)}
              />
            </Box>

            <Button variant="contained" color="success">
              SCRAPE GOOGLE
            </Button>

            <Button variant="contained" color="secondary">
              SCRAPE LINKEDIN
            </Button>

            <Button
              variant="contained"
              onClick={handleGenerateAllEmails}
              disabled={bulkGenerateState.loading}
              sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}
            >
              {bulkGenerateState.loading ? "GENERATING..." : "GENERATE EMAILS"}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {pageNotice && (
          <Alert severity={pageNotice.type} sx={{ mb: 3 }}>
            {pageNotice.text}
          </Alert>
        )}

        {bulkGenerateState.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {bulkGenerateState.error}
          </Alert>
        )}

        {bulkGenerateState.success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {bulkGenerateState.success}
          </Alert>
        )}

        {selectedMessage && (
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3, bgcolor: "#111827", color: "#fff" }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Latest Generated Email Preview
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              For: {selectedMessage.employeeName}
            </Typography>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Subject: {selectedMessage.subject}
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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
                        {job.company || "No company"} • {job.location || "No location"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
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
          </Grid>

          <Grid item xs={12} md={6}>
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
                        {msg.subject || "No subject"}
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
                        {msg.body || "No body"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
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
                        {item.to || item.email || "No recipient"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Status: {item.status || "pending"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Subject: {item.subject || "No subject"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}