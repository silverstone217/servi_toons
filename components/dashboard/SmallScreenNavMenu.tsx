"use client";
import React from "react";
import SheetComponent from "../SheetComponent";
import { AlignJustify } from "lucide-react";
import { Button } from "../ui/button";
import { DashboardPages } from "@/utils/data";
import Link from "next/link";
import { SheetClose } from "../ui/sheet";
import { useCurrentUser } from "@/hooks/UserAuth";
import AvatarUser from "../AvatarUser";
import { SwitchThemSmallScreen } from "../themes/SwitchTheme";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const SmallScreenNavMenu = () => {
  const user = useCurrentUser();
  const pathanme = usePathname();

  const handleLogOut = async () => {
    try {
      await signOut();
      toast.success("Vous avez été deconnecté!");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Oops! Une erreur est survenue!");
    }
  };

  return (
    <SheetComponent
      title="Servi Toons"
      description="Publier et gerer vos mangas, LN, manhwa ou vos illutrations facilement."
      side="left"
      trigger={
        <Button variant={"ghost"} size={"icon"}>
          <AlignJustify className="size-6" />
        </Button>
      }
      content={
        <div className="flex flex-col p-4 flex-1 border-t gap-4 transition-all duration-500 ease-in-out">
          {/* links */}
          <nav className="flex flex-col gap-4 flex-1 pb-4 border-b">
            {DashboardPages.map((lk, i) => (
              <SheetClose asChild key={i}>
                <Link href={lk.href}>
                  <div
                    className={cn(
                      "font-medium p-2",
                      "transition-all ease-in-out duration-500 shrink-0",
                      "flex items-center w-full gap-4 rounded-lg",
                      pathanme.includes(lk.href) && lk.href.length > 1
                        ? "bg-primary"
                        : "",
                      "hover:bg-primary hover:opacity-75 transition-all duration-500 ease-in-out"
                    )}
                  >
                    <lk.icon className="shrink-0 size-6" />
                    <span>{lk.label}</span>
                  </div>
                </Link>
              </SheetClose>
            ))}
          </nav>

          {/* others btn and login */}
          <div className="w-full flex flex-row-reverse items-center gap-4 flex-wrap">
            {/* logout */}
            {user && (
              <Button variant={"destructive"} onClick={handleLogOut}>
                <span>Deconnexion</span>
              </Button>
            )}

            {!user ? (
              <SheetClose asChild>
                <Link href={"/connexion"}>
                  <Button>
                    <span>Connexion</span>
                  </Button>
                </Link>
              </SheetClose>
            ) : (
              <SheetClose asChild>
                <Link href={"/profil"}>
                  <AvatarUser />
                </Link>
              </SheetClose>
            )}

            {/* Theme */}
            <SwitchThemSmallScreen />
          </div>
        </div>
      }
    />
  );
};

export default SmallScreenNavMenu;
