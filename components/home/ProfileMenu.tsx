/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarUser from "../AvatarUser";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const ProfileMenuBigScreen = () => {
  const router = useRouter();

  const handleNavigate = (url: string) => {
    router.push(`/${url}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error(
        "impossible de continuer cette action, veuillez reesayer plus tard!"
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarUser />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-6 py-5">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profil</DropdownMenuItem>
        <DropdownMenuItem>Bookmark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate("dashboard")}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNavigate("mes-contenus/nouveau")}
        >
          Ajouter un contenu
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Subscription</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant={"destructive"}
            className="w-full mt-2"
            onClick={handleSignOut}
          >
            <span>Deconnexion</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
