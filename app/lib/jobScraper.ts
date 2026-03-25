import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeGoogleJobs() {
  const url =
    "https://www.google.com/about/careers/applications/jobs/results/?q=software%20engineer";

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const jobs: any[] = [];

  $("a").each((i, el) => {
    const title = $(el).text().trim();
    const link = $(el).attr("href");

    if (title && link && link.includes("jobs")) {
      jobs.push({
        title,
        link: "https://careers.google.com" + link,
      });
    }
  });

  return jobs;
}