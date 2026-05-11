import { Worker } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
import {
  sendUserApprovalEmail,
} from "@/lib/mailer";

const connection = new IORedis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("Printed");
    console.log("Processing Job:", job.name);

    switch (job.name) {
      case "user-approval":
        await sendUserApprovalEmail(
          job.data.email,
          job.data.name
        );
        break;

      default:
        console.log("Unknown Job");
    }
  },
  {
    connection,

    // IMPORTANT
    concurrency: 1,
  }
);

worker.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.log(`Job failed: ${job?.id}`);
  console.error(err);
});

console.log("Email Worker Started...");