import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { UserIcon } from "lucide-react";
import { notFound } from "next/navigation";
import Feed from "~/components/Feed";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { createSupabase } from "~/lib/supabase/server";
import { dataOrThrow } from "~/lib/utils";
import { createQueryClient } from "~/trpc/query-client";

export default async function OtherUserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createSupabase();
    const queryClient = createQueryClient();
    const user = dataOrThrow(
        await supabase
            .from("users")
            .select("*, Observations(id)")
            .eq("id", (await params).id)
            .limit(1),
    ).at(0);
    if (!user) notFound();

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <main className="container mx-auto p-8 py-8 flex flex-col overflow-hidden">
                <div className="sticky">
                    <div className="flex flex-row items-center gap-4 mb-4">
                        <Avatar>
                            <AvatarImage src={user.avatar_url ?? undefined} />
                            <AvatarFallback>
                                <UserIcon />
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <h1 className="text-lg">{user.name}</h1>
                        </div>
                    </div>

                    <h2 className="text-xl mb-2">Observations</h2>
                </div>

                <Feed ids={user.Observations.map((o) => o.id)} filter={`user_id=${user.id}`} />
            </main>
        </HydrationBoundary>
    );
}
