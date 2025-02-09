"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "~/components/ui/drawer";
import { useSupabase } from "~/lib/supabase/client";
import { dataOrThrow } from "~/lib/utils";
import Pokemon3dRender from "./Pokemon3dRender";

export default function PictureDrawer({ id, children }: { id: string; children: ReactNode }) {
    const supabase = useSupabase();
    const { data: pokemon } = useQuery({
        queryKey: ["pokemon", id],
        async queryFn() {
            return dataOrThrow(await supabase.from("Species").select().eq("id", id).limit(1)).at(0);
        },
    });

    if (!pokemon) notFound();
    return (
        <Drawer snapPoints={["200px", 1]}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{pokemon.name}</DrawerTitle>
                    <DrawerDescription>{pokemon.scientific_name}</DrawerDescription>
                </DrawerHeader>

                {pokemon.model && (
                    <div className="mx-auto px-4 mb-4 w-full lg:max-w-3xl">
                        <Pokemon3dRender base64model={pokemon.model} />
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    );
}
