"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { useSupabase } from "~/lib/supabase/client";
import Post from "./Post";

export default function Feed(props: { ids: number[]; filter?: string }) {
    const supabase = useSupabase();
    const [ids, setIds] = useState(props.ids);
    const parentRef = useRef(null);
    const rowVirtualizer = useVirtualizer({
        count: ids.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 409,
    });

    useEffect(() => {
        const listener = supabase.realtime
            .channel("observations")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "Observations", filter: props.filter },
                (payload) => {
                    setIds((prev) => prev.concat([payload.new.id]));
                },
            );
        listener.subscribe();
        return () => {
            listener.unsubscribe();
        };
    });

    return (
        <div ref={parentRef} className="overflow-y-scroll min-h-0">
            <div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                    <div
                        key={virtualItem.key}
                        className="absolute top-0 inset-x-0"
                        style={{
                            height: `${virtualItem.size}px`,
                            transform: `translateY(${virtualItem.start}px)`,
                        }}
                    >
                        <div className="grid py-4 border-b">
                            <Post id={ids[virtualItem.index] ?? 0} key={virtualItem.key} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
