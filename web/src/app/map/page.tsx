import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import WorldMap from "~/components/map/WorldMap";
import { createSupabase } from "~/lib/supabase/server";
import { dataOrThrow } from "~/lib/utils";
import { createQueryClient } from "~/trpc/query-client";

export default async function MapPage() {
    const supabase = await createSupabase();
    const observations = dataOrThrow(await supabase.from("Observations").select());

    const queryClient = createQueryClient();
    queryClient.prefetchQuery({
        queryKey: ["observations", "all"],
        initialData: observations,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="relative grow">
                <WorldMap />
            </div>
        </HydrationBoundary>
    );
}
