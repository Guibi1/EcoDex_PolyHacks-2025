import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function dataOrThrow<D, E>(
    response: { error: E; data: null | Record<string, null> } | { error: null; data: D },
): NonNullable<D> {
    if (response.error) {
        throw response.error;
    }

    return response.data as NonNullable<D>;
}
