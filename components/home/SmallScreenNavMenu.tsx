"use client";
import React from "react";
import SheetComponent from "../SheetComponent";
import { AlignJustify } from "lucide-react";
import { Button } from "../ui/button";
import { HomeLinksPage, HomeLinksPageAdd } from "@/utils/data";
import Link from "next/link";
import { SheetClose } from "../ui/sheet";
import { useCurrentUser } from "@/hooks/UserAuth";
import AvatarUser from "../AvatarUser";
import { SwitchThemSmallScreen } from "../themes/SwitchTheme";

const SmallScreenNavMenu = () => {
  const user = useCurrentUser();
  return (
    <SheetComponent
      title="Servi Toons"
      description="Liser et savourer les meilleurs contenus diponibles dans la platefome."
      side="left"
      trigger={
        <Button variant={"ghost"} size={"icon"}>
          <AlignJustify className="size-6" />
        </Button>
      }
      content={
        <div className="flex flex-col p-4 flex-1 border-t gap-4">
          {/* links */}
          <nav className="flex flex-col gap-4 flex-1 pb-4 border-b">
            {HomeLinksPage.map((lk, i) => (
              <SheetClose asChild key={i}>
                <Link href={lk.href}>
                  <div
                    className="font-medium p-2
                transition-all ease-in-out duration-500 shrink-0
                flex items-center w-full gap-4 hover:bg-primary
                "
                  >
                    <lk.icon className="shrink-0 size-6" />
                    <span>{lk.label}</span>
                  </div>
                </Link>
              </SheetClose>
            ))}

            {/* additionnal links */}
            {HomeLinksPageAdd.map((lk, i) => (
              <SheetClose asChild key={i}>
                <Link href={lk.href}>
                  <div
                    className="font-medium p-2
                transition-all ease-in-out duration-500 shrink-0
                flex items-center w-full gap-4 hover:bg-primary
                "
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
