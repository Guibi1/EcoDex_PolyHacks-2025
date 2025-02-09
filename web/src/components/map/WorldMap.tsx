"use client";

import Mapbox from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import MapGL, { Marker, useMap } from "react-map-gl";
import { env } from "~/env";
import type { Position } from "~/lib/types";
import { Button } from "../ui/button";

export default function WorldMap() {
    const { map } = useMap();
    const { coords, getPosition } = useGeolocated();

    const positions: Position[] = [];
    useEffect(() => getPosition(), [getPosition]);

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
                            map?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 16 });
                        }}
                    />
                </Marker>

                {observations.map((pos) => (
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
                                map?.flyTo({ center: [pos.lng, pos.lat] });
                            }}
                            className="z-10"
                        >
                            POINT
                        </Button>
                    </Marker>
                ))}
            </MapGL>
        )
    );
}
