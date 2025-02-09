"use client";

import type { ReactNode } from "react";
import { MapProvider as Provider } from "react-map-gl";

export default function MapProvider({ children }: { children: ReactNode }) {
    return <Provider>{children}</Provider>;
}
