import Feed from "~/components/Feed";
import { createSupabase } from "~/lib/supabase/server";
import { dataOrThrow } from "~/lib/utils";

export default async function ObservationsFeed() {
    const supabase = await createSupabase();
    const ids = dataOrThrow(
        await supabase.from("Observations").select("id").order("created_at", { ascending: false }),
    ).map((o) => o.id);

    return (
        <main className="container mx-auto p-8 py-8 flex flex-col overflow-hidden">
            <div className="sticky">
                <h2 className="text-xl mb-2">Observations</h2>
            </div>

            <Feed ids={ids} />
        </main>
    );
}
