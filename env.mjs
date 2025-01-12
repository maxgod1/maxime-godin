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
    NEXT_PUBLIC_STATIC_IMG_URL: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_STATIC_IMG_URL: process.env.NEXT_PUBLIC_STATIC_IMG_URL,
  },
});
