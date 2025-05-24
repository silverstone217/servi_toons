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
  const pathname = usePathname();

  const handleLogOut = async () => {
    try {
      await signOut();
      toast.success("Vous avez été déconnecté !");
    } catch {
      toast.error("Oops! Une erreur est survenue !");
    }
  };

  return (
    <SheetComponent
      side="left"
      title="Servi Toons"
      description="Publiez et gérez vos mangas, LN, manhwa ou illustrations facilement."
      trigger={
        <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
          <AlignJustify className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </Button>
      }
      content={
        <div className="flex flex-col h-full p-6 gap-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 border-b border-gray-200 dark:border-gray-700 pb-6 overflow-y-auto max-h-[60vh]">
            {DashboardPages.map((link, idx) => {
              const isActive =
                pathname?.startsWith(link.href) && link.href.length > 1;
              return (
                <SheetClose asChild key={idx}>
                  <Link href={link.href}>
                    <div
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg font-medium transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-800 dark:text-gray-200 hover:bg-primary hover:bg-opacity-20 dark:hover:bg-primary dark:hover:bg-opacity-30"
                      )}
                    >
                      <link.icon className="w-6 h-6 flex-shrink-0" />
                      <span>{link.label}</span>
                    </div>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          {/* Bottom actions: Logout / Login / Profile & Theme */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {user && (
              <Button
                variant="destructive"
                onClick={handleLogOut}
                className="flex-1 min-w-[120px]"
              >
                Déconnexion
              </Button>
            )}

            {!user ? (
              <SheetClose asChild>
                <Link href="/connexion" className="flex-1 min-w-[120px]">
                  <Button className="w-full">Connexion</Button>
                </Link>
              </SheetClose>
            ) : (
              <SheetClose asChild>
                <Link href="/profil" aria-label="Profil utilisateur">
                  <AvatarUser />
                </Link>
              </SheetClose>
            )}

            <div className="ml-auto">
              <SwitchThemSmallScreen />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default SmallScreenNavMenu;
