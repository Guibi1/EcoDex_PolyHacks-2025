"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "~/lib/supabase/client";
import type { Database } from "~/lib/supabase/database.types";
import { Skeleton } from "~/components/ui/skeleton";

export default function Observations() {
    const supabase = useSupabase();
    const [observations, setObservations] = useState<Database["public"]["Tables"]["Observations"]["Row"][]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchObservations() {
            const { data, error } = await supabase
                .from("Observations") // Database table remains "Observations"
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
            <h1 className="text-2xl font-bold mb-4">Observations</h1>
            <div className="space-y-4 overflow-auto h-screen">
                {loading
                    ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-64 rounded-md" />)
                    : observations.map((obs) => {
                          // Construct the correct path based on user_id and image_id
                          const { data } = supabase.storage.from("images").getPublicUrl(obs.image);
                          const publicUrl = data?.publicUrl;

                          console.log("Generated Public URL:", publicUrl);

                          return (
                              <div key={obs.id} className="bg-muted p-4 rounded-lg shadow-md">
                                  {obs.image && publicUrl && (
                                      <img
                                          src={publicUrl}
                                          alt="Im going to kill myself"
                                          width={500}
                                          height={300}
                                          className="rounded-md"
                                      />
                                  )}
                                  <p className="mt-2 text-gray-700">{obs.species}</p>
                                  <p className="text-sm text-gray-500">{new Date(obs.created_at).toLocaleString()}</p>
                              </div>
                          );
                      })}
            </div>
        </div>
    );
}
