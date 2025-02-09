export type Position = {
    lng: number;
    lat: number;
};

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
