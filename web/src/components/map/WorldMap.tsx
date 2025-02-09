"use client";

import { FlagIcon } from "lucide-react";
import Mapbox, { type LngLat } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import MapGL, { Layer, Marker, Source, useMap } from "react-map-gl";
import { toast } from "sonner";
import { env } from "~/env";
import type { Position } from "~/lib/types";
import { Button } from "../ui/button";

export default function WorldMap() {
    const { map } = useMap();
    const { coords, getPosition } = useGeolocated();
    const [styleLoaded, setStyleLoaded] = useState(false);
    const [pointClicked, setPointClicked] = useState<LngLat | null>(null);

    const positions: Position[] = [];

    useEffect(() => {
        getPosition();
        setStyleLoaded(map?.isStyleLoaded() ?? false);
        if (!map) return;

        const hop = () => setStyleLoaded(true);
        map.on("style.load", hop);
        return () => {
            map.off("styledata", hop);
        };
    }, [map, getPosition]);

    return (
        coords && (
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
                onClick={(e) => setPointClicked(e.lngLat)}
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
                            setPointClicked(null);
                            map?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 16 });
                        }}
                    />
                </Marker>

                {positions.map((pos) => (
                    <Marker
                        longitude={pos.lng}
                        latitude={pos.lat}
                        anchor="center"
                        rotationAlignment="viewport"
                        key={pos.lng}
                    >
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPointClicked(null);
                                map?.flyTo({ center: [pos.lng, pos.lat] });
                            }}
                            className="z-10"
                        >
                            POINT
                        </Button>
                    </Marker>
                ))}

                {styleLoaded &&
                    positions.map((pos) => (
                        <Source
                            type="geojson"
                            data={{
                                type: "FeatureCollection",
                                features: [
                                    {
                                        type: "Feature",
                                        geometry: {
                                            type: "Point",
                                            coordinates: [pos.lng, pos.lat],
                                        },
                                    },
                                ],
                            }}
                            key={pos.lng}
                        >
                            <Layer
                                type="circle"
                                paint={{
                                    "circle-radius": {
                                        stops: [
                                            [0, 0],
                                            [20, 200],
                                        ],
                                        base: 2,
                                    },
                                    "circle-color": "rgba(34,197,94,0.2)",
                                    "circle-stroke-color": "rgb(34,197,94)",
                                    "circle-stroke-width": 1,
                                }}
                            />
                        </Source>
                    ))}

                {pointClicked && (
                    <Marker
                        longitude={pointClicked.lng}
                        latitude={pointClicked.lat}
                        anchor="center"
                        rotationAlignment="viewport"
                    >
                        <Button
                            size="icon"
                            className="z-10 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                const id = nanoid();
                                toast.success("A drone is being sent to this location", {});
                                setPointClicked(null);
                            }}
                        >
                            <FlagIcon />
                        </Button>
                    </Marker>
                )}
            </MapGL>
        )
    );
}
