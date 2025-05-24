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
      side="left"
      title="Servi Toons"
      description="Lisez et savourez les meilleurs contenus disponibles sur la plateforme."
      trigger={
        <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
          <AlignJustify className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </Button>
      }
      content={
        <div className="flex flex-col h-full p-6 gap-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
            {[...HomeLinksPage, ...HomeLinksPageAdd].map((link, idx) => (
              <SheetClose asChild key={idx}>
                <Link href={link.href}>
                  <div className="flex items-center gap-4 p-3 rounded-md text-gray-800 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                    <link.icon className="w-6 h-6 flex-shrink-0 text-primary" />
                    <span className="font-medium">{link.label}</span>
                  </div>
                </Link>
              </SheetClose>
            ))}
          </nav>

          {/* Bottom actions: User & Theme */}
          <div className="flex items-center justify-between">
            {!user ? (
              <SheetClose asChild>
                <Link href="/connexion">
                  <Button size="sm" className="w-full">
                    Connexion
                  </Button>
                </Link>
              </SheetClose>
            ) : (
              <SheetClose asChild>
                <Link href="/profil" aria-label="Profil utilisateur">
                  <AvatarUser />
                </Link>
              </SheetClose>
            )}

            <SwitchThemSmallScreen />
          </div>
        </div>
      }
    />
  );
};

export default SmallScreenNavMenu;
