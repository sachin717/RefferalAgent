import cron from "node-cron";
import { runAutomation } from "./automation";
import { processQueue } from "./queueSender";

export function startCron() {
  cron.schedule("* * * * *", async () => {
    console.log("Running automation");
    // await runAutomation();
  });

  cron.schedule("* * * * *", async () => {
    console.log("Sending queue");
    // await processQueue();
  });
}