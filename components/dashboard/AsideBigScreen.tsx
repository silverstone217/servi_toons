"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardPages } from "@/utils/data";
import { CircleHelp } from "lucide-react";
import { Button } from "../ui/button";
import { SwitchThemSmallScreen } from "../themes/SwitchTheme";
import AvatarUser from "../AvatarUser";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AsideBigScreen = () => {
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
    <aside
      className="hidden lg:flex flex-col w-72 h-screen 
    bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
    transition-colors duration-300"
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center 
      h-20 border-b border-gray-200 dark:border-gray-700 px-6"
      >
        <Link
          href="/"
          className="text-2xl 
          font-extrabold select-none text-gray-900 dark:text-white flex gap-1"
        >
          <span>Servi</span>
          <span className="text-primary">Toons</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {DashboardPages.map((item, idx) => {
          const active =
            pathname?.startsWith(item.href) && item.href.length > 1;
          return (
            <Link
              key={idx}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-md px-4 py-3 font-semibold transition-colors",
                active
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-6 flex flex-col gap-5">
        {/* Aide */}
        <Link
          href="#"
          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
        >
          <CircleHelp className="w-5 h-5" />
          <span className="font-medium">Aide</span>
        </Link>

        {/* Profil & Thème */}
        <div className="flex items-center justify-start gap-4">
          <SwitchThemSmallScreen />

          <Link
            href="/profil"
            aria-label="Profil utilisateur"
            className="rounded-full  focus-visible:outline-2 focus-visible:outline-primary"
          >
            <AvatarUser />
          </Link>
        </div>

        {/* Déconnexion */}
        <Button variant="destructive" onClick={handleLogOut} className="w-full">
          Déconnexion
        </Button>

        {/* Copyright */}
        <footer className="text-center text-xs text-gray-400 dark:text-gray-500 select-none mt-4">
          © SERVI TOONS {new Date().getFullYear()}
        </footer>
      </div>
    </aside>
  );
};

export default AsideBigScreen;
