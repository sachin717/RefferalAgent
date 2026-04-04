type GenerateLeadMessageInput = {
  candidateName: string;
  candidateHeadline: string;
  candidateSummary: string;
  preferredRoleTitle: string;
  preferredRoleSummary: string;
  leadName: string;
  leadCompany: string;
  leadRole?: string | null;
  commonGround?: string | null;
  notes?: string | null;
};

export async function generateLeadMessage(input: GenerateLeadMessageInput) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  const apiVersion =
    process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

  if (!endpoint || !apiKey || !deployment) {
    throw new Error("Azure OpenAI env vars are missing");
  }

  const prompt = `
You are writing a short LinkedIn/referral outreach message.

Write a concise, natural, professional message.
Do not sound robotic.
Do not oversell.
Do not use bullet points.
Keep it under 120 words.
Ask politely for guidance or referral support.
Mention only the most relevant background.

Candidate:
Name: ${input.candidateName}
Headline: ${input.candidateHeadline}
Summary: ${input.candidateSummary}

Preferred role:
Title: ${input.preferredRoleTitle}
Summary: ${input.preferredRoleSummary}

Lead:
Name: ${input.leadName}
Company: ${input.leadCompany}
Role: ${input.leadRole || "Unknown"}

Extra context:
Common ground: ${input.commonGround || "None"}
Notes: ${input.notes || "None"}

Return only the message text.
`.trim();

  const response = await fetch(
    `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You write concise, professional LinkedIn outreach messages for referral and networking use cases.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 220,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI request failed: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("No message returned from Azure OpenAI");
  }

  return content;
}