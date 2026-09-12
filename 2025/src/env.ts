import { createEnv } from "@t3-oss/env-nextjs";
import * as dotenv from "dotenv";
import { z } from "zod";

// Load .env files during the build time
dotenv.config();

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    // This is a shared secret between the server and the client.
    // It's used to introspect graphql schema.
    SCHEMA_TOKEN: z.string(),
    UPLOADTHING_TOKEN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXT_PUBLIC_LOGGING_DISABLED: z
      .string()
      .default(process.env.NODE_ENV === "production" ? "true" : "false")
      .refine((val) => val === "true" || val === "false")
      .transform((val) => val === "true"),
    NEXT_PUBLIC_SERVER_HTTP_URL: z.string().url(),
    NEXT_PUBLIC_SERVER_WEBSOCKET_URL: z.string().url(),
    NEXT_PUBLIC_THIS_APP_URL: z.string().url(),
    NEXT_PUBLIC_UPLOADTHING_URL: z.string().url(),
    NEXT_PUBLIC_RAZORPAY_KEY: z.string(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    SCHEMA_TOKEN: process.env.SCHEMA_TOKEN,
    NEXT_PUBLIC_RAZORPAY_KEY: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_LOGGING_DISABLED: process.env.NEXT_PUBLIC_LOGGING_DISABLED,
    NEXT_PUBLIC_SERVER_HTTP_URL: process.env.NEXT_PUBLIC_SERVER_HTTP_URL,
    NEXT_PUBLIC_SERVER_WEBSOCKET_URL:
      process.env.NEXT_PUBLIC_SERVER_WEBSOCKET_URL,
    NEXT_PUBLIC_THIS_APP_URL: process.env.NEXT_PUBLIC_THIS_APP_URL,
    NEXT_PUBLIC_UPLOADTHING_URL: process.env.NEXT_PUBLIC_UPLOADTHING_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  onInvalidAccess: (variable) => {
    throw new Error(
      "❌ Attempted to access a server-side environment variable on the client: " + variable,
    );
  },
});
