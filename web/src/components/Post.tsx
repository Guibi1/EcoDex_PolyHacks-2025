"use client";

import { useQuery } from "@tanstack/react-query";
import { BirdIcon, BombIcon, LoaderIcon, RotateCcwIcon, StarIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useSupabase } from "~/lib/supabase/client";
import type { Observation, Species, User } from "~/lib/types";
import { dataOrThrow } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function Post(props: { id: number }) {
    const supabase = useSupabase();
    const {
        data: observation,
        refetch,
        isPending,
    } = useQuery({
        queryKey: ["observation", props.id],
        async queryFn() {
            const obs = dataOrThrow(
                await supabase
                    .from("Observations")
                    .select("*, Species(*), users(*)")
                    .eq("id", props.id)
                    .limit(1)
                    .returns<(Observation & { users: User; Species: Species })[]>(),
            ).at(0);
            return obs;
        },
    });
    const imageSrc = useMemo(
        () => observation && supabase.storage.from("images").getPublicUrl(observation.image).data.publicUrl,
        [observation, supabase.storage.from],
    );

    if (isPending)
        return (
            <div className="flex flex-col items-center">
                <LoaderIcon className="size-10 animate-spin" />
            </div>
        );

    if (!observation)
        return (
            <div className="flex flex-col items-center">
                <BombIcon className="size-20" />
                <p>Impossible de charger la publication</p>

                <Button onClick={() => refetch()}>
                    <RotateCcwIcon />
                    Réessayer
                </Button>
            </div>
        );

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4">
                <Avatar className="size-8">
                    <AvatarFallback>
                        <BirdIcon className="size-5" />
                    </AvatarFallback>
                </Avatar>

                <div>
                    <h1 className="text-lg font-semibold">{observation.Species?.name}</h1>
                    <p className="text-muted-foreground">{observation.Species?.scientific_name}</p>
                </div>
            </div>

            <img src={imageSrc} alt="observation" className="w-full h-64 object-cover rounded" />

            <div className="flex gap-4 items-center justify-between">
                <div className="h-6 flex flex-row items-center">
                    <Avatar className="size-6 mr-2">
                        <AvatarImage src={observation.users.avatar_url ?? undefined} />
                        <AvatarFallback>
                            <UserIcon />
                        </AvatarFallback>
                    </Avatar>

                    <p>
                        Par <Link href={`/profile/${observation.users.id}`}>{observation.users.name}</Link>
                    </p>
                </div>

                <Like />
            </div>
        </div>
    );
}

function Like() {
    return (
        <Button variant="ghost" size="icon">
            <StarIcon />
        </Button>
    );
}
