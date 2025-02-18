import type { Database } from "./supabase/database.types";

export type Position = {
    lng: number;
    lat: number;
};

export type Observation = Omit<Database["public"]["Tables"]["Observations"]["Row"], "position"> & {
    position: Position;
};

export type Species = Database["public"]["Tables"]["Species"]["Row"];

export type User = Database["public"]["Tables"]["users"]["Row"];

declare module "@supabase/auth-js" {
    interface UserMetadata {
        avatar_url: string;
        custom_claims: string;
        email: string;
        email_verified: string;
        full_name: string;
        iss: string;
        name: string;
        phone_verified: string;
        picture: string;
        provider_id: string;
        sub: string;
    }
}
