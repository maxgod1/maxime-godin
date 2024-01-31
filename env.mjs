import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
  },
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z.any(),
    NEXT_PUBLIC_POSTHOG_KEY: z.any(),
    NEXT_PUBLIC_POSTHOG_HOST: z.any(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
});
