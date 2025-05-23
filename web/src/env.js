import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        MISTRAL_API_KEY: z.string(),
        NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    },

    client: {
        NEXT_PUBLIC_MAPBOX_API: z.string(),

        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    },

    runtimeEnv: {
        MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
        NODE_ENV: process.env.NODE_ENV,

        NEXT_PUBLIC_MAPBOX_API: process.env.NEXT_PUBLIC_MAPBOX_API,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },

    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});
