"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useQuery } from "@tanstack/react-query";
import { cache } from "react";
import { env } from "~/env";
import type { Database } from "./database.types";

export const useSupabase = cache(() =>
    createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
);

export function useUser() {
    const { data } = useQuery({
        queryKey: ["user", "current"],
        async queryFn() {
            const supabase = useSupabase();
            return await supabase.auth.getUser().then(({ data }) => data.user);
        },
    });

    return data;
}
