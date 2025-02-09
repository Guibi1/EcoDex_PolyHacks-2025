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
            const imageBuffer = decode(base64image.split(",")[1] as string);

            // Upload image to Supabase storage
            dataOrThrow(
                await supabase.storage.from("images").upload(imagePath, imageBuffer, {
                    contentType: "image/jpeg",
                }),
            );

            // Send image URL to the external API for classification
            const response = await fetch("https://helpful-blatantly-koi.ngrok-free.app/get_image_result", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: supabase.storage.from("images").getPublicUrl(imagePath) }),
            });

            if (!response.ok) {
                throw new Error("Failed to send image to the server.");
            }

            // Attempt to parse the response as JSON
            const apiData = await response.json();

            // Safely modify and parse the predicted_class string
            let predictions = [];
            try {
                // Replace Python-style tuples with valid JSON array format
                const formattedPredictions = apiData.predicted_class
                    .replace(/\(/g, "[") // Replace opening parentheses with opening brackets
                    .replace(/\)/g, "]") // Replace closing parentheses with closing brackets
                    .replace(/'/g, '"'); // Replace single quotes with double quotes for valid JSON

                // Now parse the properly formatted string as JSON
                predictions = JSON.parse(formattedPredictions);
            } catch (e) {
                console.error("Error parsing predicted_class:", e);
                throw new Error("Failed to parse predictions.");
            }

            // Extract the ID from the very first tuple (highest prediction)
            const highestPredictionId = predictions.length > 0 ? predictions[0][0] : null;
            if (!highestPredictionId) {
                throw new Error("No valid predictions found.");
            }

            // Create observation record in Supabase with the species ID (highest prediction)
            dataOrThrow(
                await supabase
                    .from("Observations")
                    .insert({
                        image: imagePath,
                        position: { lng: coords.longitude, lat: coords.latitude } satisfies Position,
                        species: highestPredictionId, // Store the ID of the highest prediction
                    })
                    .select("id"),
            );
        },
        onSuccess() {
            router.push("/map");
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
