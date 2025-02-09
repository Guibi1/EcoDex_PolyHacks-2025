import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navigation from "~/components/Navigation";
import MapProvider from "~/components/map/MapProvider";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ThemeProvider } from "~/components/ThemeProvider";
import { createSupabase } from "~/lib/supabase/server";
import { createQueryClient } from "~/trpc/query-client";
import "../tailwind.css";

export const metadata: Metadata = {
    title: "Plant",
    description: "Generated by create-t3-app",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
    const supabase = await createSupabase();
    const user = await supabase.auth.getUser().then((d) => d.data.user);

    const queryClient = createQueryClient();
    queryClient.prefetchQuery({
        queryKey: ["user", "current"],
        initialData: user,
    });

    return (
        <TRPCReactProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <MapProvider>
                    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
                        <body className="h-dvh">
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="system"
                                enableSystem
                                disableTransitionOnChange
                            >
                                {children}

                                <Navigation />

                                <Toaster position="top-center" />
                            </ThemeProvider>
                        </body>
                    </html>
                </MapProvider>
            </HydrationBoundary>
        </TRPCReactProvider>
    );
}
