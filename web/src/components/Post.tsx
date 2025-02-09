"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { BirdIcon, BombIcon, LeafIcon, LoaderIcon, RotateCcwIcon, StarIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import { useSupabase, useUser } from "~/lib/supabase/client";
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
                        {observation.isBird ? <BirdIcon className="size-5" /> : <LeafIcon className="size-5" />}
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

                <Like postId={observation.id} />
            </div>
        </div>
    );
}

function Like({ postId }: { postId: number }) {
    const supabase = useSupabase();
    const user = useUser();
    const {
        data: likes,
        isPending: loading,
        refetch,
    } = useQuery({
        queryKey: ["likes", postId],
        async queryFn() {
            const likes = dataOrThrow(await supabase.from("Likes").select("user_id").eq("observation_id", postId));
            return likes;
        },
    });

    const { mutate: toggleLike, isPending } = useMutation({
        async mutationFn() {
            if (!user) return false;
            if (likes?.some((l) => l.user_id === user.id)) {
                dataOrThrow(await supabase.from("Likes").delete().eq("user_id", user.id).eq("observation_id", postId));
            } else {
                dataOrThrow(await supabase.from("Likes").insert({ user_id: user.id, observation_id: postId }));
            }
        },
        onSuccess() {
            refetch();
        },
        onError(error) {
            toast(error.name, {
                icon: <BombIcon />,
                description: error.message,
            });
        },
    });

    return (
        <div className="flex items-center">
            <p className="text-sm">{likes?.length}</p>
            <Button variant="ghost" size="icon" disabled={loading || isPending} onClick={() => toggleLike()}>
                <StarIcon className={user && likes?.some((l) => l.user_id === user.id) ? "fill-current" : ""} />
            </Button>
        </div>
    );
}
