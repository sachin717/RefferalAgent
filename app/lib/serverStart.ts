import { startCron } from "./cron";

let started = false;

export function startServer() {
  if (!started) {
    console.log("Starting cron...");
    // startCron();
    started = true;
  }
}