"use client";

import { CameraIcon, LayoutListIcon, LogInIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSupabase, useUser } from "~/lib/supabase/client";
import PictureDrawer from "./PictureDrawer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navigation() {
    const router = useRouter();
    const supabase = useSupabase();
    const user = useUser();

    return (
        <div className="mt-2 border-t">
            <div className="container p-2 mx-auto flex justify-around items-center">
                <Button variant="ghost" className="size-10 rounded-full bg-muted">
                    <LayoutListIcon />
                </Button>

                <PictureDrawer>
                    <Button className="size-12 rounded-full">
                        <CameraIcon />
                    </Button>
                </PictureDrawer>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src={user?.user_metadata.avatar_url} />
                            <AvatarFallback>
                                <UserIcon />
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    {user ? (
                        <DropdownMenuContent className="w-40">
                            <DropdownMenuLabel>{user?.user_metadata.full_name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={async () => {
                                    const { error } = await supabase.auth.signOut();
                                    if (error) toast(error.name, { description: error.message });
                                    else router.refresh();
                                }}
                            >
                                <LogOutIcon />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    ) : (
                        <DropdownMenuContent className="w-40">
                            <DropdownMenuItem
                                onClick={() =>
                                    supabase.auth.signInWithOAuth({
                                        provider: "discord",
                                        options: { redirectTo: `${location.origin}/api/auth/callback` },
                                    })
                                }
                            >
                                <LogInIcon />
                                Log in
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
            </div>
        </div>
    );
}
