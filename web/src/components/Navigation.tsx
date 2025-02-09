"use client";

import {
    CameraIcon,
    ComputerIcon,
    HomeIcon,
    LayoutListIcon,
    LogInIcon,
    LogOutIcon,
    MapIcon,
    MoonIcon,
    SunIcon,
    SunMoonIcon,
    UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSupabase, useUser } from "~/lib/supabase/client";
import PictureDrawer from "./PictureDrawer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navigation() {
    const router = useRouter();
    const { setTheme } = useTheme();
    const supabase = useSupabase();
    const user = useUser();

    return (
        <div className="border-t bg-background">
            <div className="container p-2 mx-auto flex justify-around items-center">
                <Button variant="ghost" className="size-10 rounded-full bg-muted" asChild>
                    <Link href="/">
                        <HomeIcon />
                    </Link>
                </Button>

                <Button variant="ghost" className="size-10 rounded-full bg-muted" asChild>
                    <Link href="/feed">
                        <LayoutListIcon />
                    </Link>
                </Button>

                <PictureDrawer>
                    <Button className="size-12 rounded-full">
                        <CameraIcon />
                    </Button>
                </PictureDrawer>

                <Button variant="ghost" className="size-10 rounded-full bg-muted" asChild>
                    <Link href="/map">
                        <MapIcon />
                    </Link>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src={user?.user_metadata.avatar_url} />
                            <AvatarFallback>
                                <UserIcon />
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-60">
                        {user && (
                            <DropdownMenuLabel className="text-lg">
                                <p className="font-light text-sm">Bonjour, </p>
                                {user?.user_metadata.full_name}
                            </DropdownMenuLabel>
                        )}

                        {user && (
                            <DropdownMenuItem asChild>
                                <Link href={`/profile/${user.id}`}>
                                    <UserIcon />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <SunMoonIcon />
                                    Theme
                                </DropdownMenuSubTrigger>

                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => setTheme("light")}>
                                            <SunIcon />
                                            Light
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                                            <MoonIcon />
                                            Dark
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("system")}>
                                            <ComputerIcon />
                                            System
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />

                        {user ? (
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
                        ) : (
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
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
