"use client";

import { HomeLinksPage } from "@/utils/data";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { SwitchThemSmallScreen } from "../themes/SwitchTheme";
import { useCurrentUser } from "@/hooks/UserAuth";
import { ProfileMenuBigScreen } from "./ProfileMenu";
import SmallScreenNavMenu from "./SmallScreenNavMenu";

const Header = () => {
  const user = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <SmallScreenNavMenu />
            </div>
            <Link
              href="/"
              className="flex items-center gap-1 font-extrabold text-xl text-gray-900 dark:text-white select-none"
            >
              <span>Servi</span>
              <span className="text-primary">Toons</span>
            </Link>
          </div>

          {/* Center: Nav links (desktop only) */}
          <nav className="hidden lg:flex space-x-8">
            {HomeLinksPage.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 font-medium hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" aria-label="Rechercher">
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>

            <SwitchThemSmallScreen />

            {!user ? (
              <Link href="/connexion" className="hidden lg:inline-block">
                <Button size="sm" className="px-4 py-2">
                  Connexion
                </Button>
              </Link>
            ) : (
              <ProfileMenuBigScreen />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
