export async function findEmailApollo(name: string, company: string) {
  const apiKey = process.env.APOLLO_API_KEY;

  if (!apiKey) {
    console.error("APOLLO_API_KEY is missing");
    return null;
  }

  const res = await fetch("https://api.apollo.io/v1/people/match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify({
      name,
      organization_name: company,
    }),
  });

  const data = await res.json();
  console.log("Apollo match response:", data);

  return data?.person?.email || null;
}