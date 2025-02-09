"use client";

import { useMutation } from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";
import { BombIcon, LoaderIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { type ReactNode, useRef } from "react";
import { useGeolocated } from "react-geolocated";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
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
import type { Position } from "~/lib/types";
import { dataOrThrow } from "~/lib/utils";

export default function PictureDrawer({ children }: { children: ReactNode }) {
    const router = useRouter();
    const supabase = useSupabase();
    const { coords, getPosition } = useGeolocated();
    const camera = useRef<Webcam | null>(null);

    const { mutate: uploadPicture, isPending } = useMutation({
        async mutationFn() {
            if (!camera.current || !coords) return;
            const { user } = dataOrThrow(await supabase.auth.getUser());

            const base64image = camera.current.getScreenshot() as string;
            const imagePath = `${user.id}/${nanoid()}.jpeg`;
            dataOrThrow(
                await supabase.storage.from("images").upload(imagePath, decode(base64image.split(",")[1] as string), {
                    contentType: "image/jpeg",
                }),
            );

            const observation = dataOrThrow(
                await supabase
                    .from("Observations")
                    .insert({
                        image: imagePath,
                        position: { lng: coords.longitude, lat: coords.latitude } satisfies Position,
                    })
                    .select("id"),
            ) as { id: string }[];

            return observation.at(0)?.id;
        },
        onSuccess(image) {
            router.push(`/uploads/${image}`);
        },
        onError(error) {
            toast(error.name, {
                icon: <BombIcon />,
                description: error.message,
            });
        },
    });

    return (
        <Drawer onOpenChange={getPosition}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Take a picture of the plant or animal</DrawerTitle>
                    <DrawerDescription>Make sure to center the subject</DrawerDescription>
                </DrawerHeader>

                <div className="mx-auto px-4 mb-4 w-full lg:max-w-3xl">
                    <div className="relative aspect-video grid place-items-center rounded-lg overflow-hidden">
                        <Webcam ref={camera} audio={false} />

                        <LoaderIcon className="animate-spin -z-50" />
                    </div>
                </div>

                <DrawerFooter>
                    <Button
                        size="lg"
                        onClick={() => uploadPicture()}
                        disabled={!camera.current || !coords || isPending}
                    >
                        {isPending && <LoaderIcon className="animate-spin" />}
                        Take picture
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
