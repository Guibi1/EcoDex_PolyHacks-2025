"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "~/components/ui/drawer";
import { useSupabase } from "~/lib/supabase/client";
import { dataOrThrow } from "~/lib/utils";
import Pokemon3dRender from "./Pokemon3dRender";

export default function PokemonDrawer({ id, children }: { id: number; children: ReactNode }) {
    const supabase = useSupabase();
    const { data: observation } = useQuery({
        queryKey: ["observation", id],
        async queryFn() {
            return dataOrThrow(
                await supabase.from("Observations").select("*, Species(*), users(*)").eq("id", id).limit(1),
            ).at(0);
        },
    });

    if (!observation || !observation.Species) return null;
    return (
        <Drawer>
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{observation.Species.name}</DrawerTitle>
                    <DrawerDescription>{observation.Species.scientific_name}</DrawerDescription>
                </DrawerHeader>

                {observation.Species.model && (
                    <div className="mx-auto px-4 mb-4 w-full lg:max-w-3xl">
                        <Pokemon3dRender base64model={observation.Species.model} />
                    </div>
                )}

                <DrawerFooter>
                    <p>{observation.Species.description}</p>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
