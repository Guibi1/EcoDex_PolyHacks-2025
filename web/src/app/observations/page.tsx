"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "~/lib/supabase/client";
import type { Database } from "~/lib/supabase/database.types";
import { Skeleton } from "~/components/ui/skeleton";
import Post from "~/components/Post";

export default function Observations() {
    const supabase = useSupabase();
    const [observations, setObservations] = useState<Database["public"]["Tables"]["Observations"]["Row"][]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchObservations() {
            const { data, error } = await supabase
                .from("Observations")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching observations:", error);
            } else {
                setObservations(data || []);
            }
            setLoading(false);
        }

        fetchObservations();
    }, [supabase]);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">All Observations</h1>
            <div className="space-y-4 overflow-auto h-screen">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-64 rounded-md" />)
                ) : observations.length > 0 ? (
                    observations.map((obs) => (
                        <Post
                            key={obs.id}
                            id={obs.id}
                            image={obs.image}
                            species={obs.species}
                            created_at={obs.created_at}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No observations found.</p>
                )}
            </div>
        </div>
    );
}
