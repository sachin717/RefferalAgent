import puppeteer from "puppeteer";

export async function findGoogleEmployees() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto("https://www.linkedin.com/login");

  console.log("Login manually then press ENTER");

  await new Promise((r) => process.stdin.once("data", r));

  await page.goto(
    "https://www.linkedin.com/search/results/people/?keywords=google%20software%20engineer"
  );

await new Promise((resolve) => setTimeout(resolve, 5000));

  const people = await page.evaluate(() => {
    const results: any[] = [];

    document.querySelectorAll("a").forEach((a) => {
      const name = a.textContent;

      if (name && a.href.includes("/in/")) {
        results.push({
          name,
          profile: a.href,
        });
      }
    });
    

    return results;
  });

  await browser.close();

  return people;
}