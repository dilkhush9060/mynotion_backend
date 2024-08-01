import { Queue } from "bullmq";
import { configEnv } from "@/config";

export const newRegistrationQueue = new Queue("new-registration", {
  connection: {
    host: configEnv.REDIS_URL.split(":")[0],
    port: Number(configEnv.REDIS_URL.split(":")[1]),
  },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});
