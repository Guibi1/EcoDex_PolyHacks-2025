"use client";

import { useQuery } from "@tanstack/react-query";
import { BirdIcon, LeafIcon, LocateIcon } from "lucide-react";
import Mapbox from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import MapGL, { Marker, useMap } from "react-map-gl";
import { env } from "~/env";
import { useSupabase } from "~/lib/supabase/client";
import type { Observation } from "~/lib/types";
import { dataOrThrow } from "~/lib/utils";
import PokemonDrawer from "../PokemonDrawer";
import { Button } from "../ui/button";

export default function WorldMap() {
    const { map } = useMap();
    const supabase = useSupabase();
    const { coords, getPosition } = useGeolocated();
    useEffect(() => getPosition(), [getPosition]);

    const { data: observations } = useQuery({
        queryKey: ["observations", "all"],
        async queryFn() {
            return dataOrThrow(await supabase.from("Observations").select().returns<Observation[]>());
        },
    });

    return (
        <>
            {coords && (
                <MapGL
                    // @ts-ignore Mapbox package version
                    mapLib={Mapbox}
                    mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_API}
                    id="map"
                    initialViewState={{
                        longitude: coords?.longitude,
                        latitude: coords?.latitude,
                        zoom: 16,
                        pitch: 20,
                    }}
                    mapStyle="mapbox://styles/guibi/cm3tlr9vo00hc01rwbr7ga0us"
                >
                    <Marker
                        longitude={coords.longitude}
                        latitude={coords.latitude}
                        anchor="center"
                        rotationAlignment="viewport"
                    >
                        <button
                            type="button"
                            className="z-20 size-6 rounded-full ring-3 border-4 ring-blue-700 bg-blue-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                map?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 17 });
                            }}
                        />
                    </Marker>

                    {observations
                        ?
                        .map((observation) => (
                            <Marker
                                longitude={observation.position.lng}
                                latitude={observation.position.lat}
                                anchor="center"
                                rotationAlignment="viewport"
                                key={observation.id}
                            >
                                <PokemonDrawer id={observation.species ?? ""}>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            map?.flyTo({
                                                center: [observation.position.lng, observation.position.lat],
                                                zoom: 19,
                                            });
                                        }}
                                        className="z-10"
                                    >
                                        {observation.isBird ? <BirdIcon /> : <LeafIcon />}
                                    </Button>
                                </PokemonDrawer>
                            </Marker>
                        ))}
                </MapGL>
            )}

            {coords && (
                <Button
                    size="icon"
                    className="absolute size-10 text-lg bottom-2 right-2 z-50"
                    onClick={() => map?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 19 })}
                >
                    <LocateIcon className="size-5!" />
                </Button>
            )}
        </>
    );
}
