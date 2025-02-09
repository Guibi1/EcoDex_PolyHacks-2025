"use client";

import { useSupabase } from "~/lib/supabase/client";
import { Card, CardContent } from "~/components/ui/card";

interface PostProps {
    id: string;
    image: string;
    species: string;
    created_at: string;
}

export default function Post({ id, image, species, created_at }: PostProps) {
    const supabase = useSupabase();

    // Generate public URL for the image
    const { data } = supabase.storage.from("images").getPublicUrl(image);
    const publicUrl = data?.publicUrl;

    return (
        <Card key={id} className="rounded-2xl shadow-md border border-gray-200">
            <CardContent className="p-4">
                {image && publicUrl && (
                    <img 
                        src={publicUrl} 
                        // biome-ignore lint/a11y/noRedundantAlt: <explanation>
                        alt="Observation Image" 
                        className="w-full h-64 object-cover rounded-md"
                    />
                )}
                <p className="mt-3 text-lg font-semibold text-gray-800">{species}</p>
                <p className="text-sm text-gray-500">{new Date(created_at).toLocaleString()}</p>
            </CardContent>
        </Card>
    );
}
