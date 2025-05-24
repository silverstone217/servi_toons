"use client";

import React from "react";
import SmallScreenNavMenu from "../dashboard/SmallScreenNavMenu";
import Link from "next/link";

const HeaderSmallScreen = () => {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <SmallScreenNavMenu />
            <Link
              href="/"
              className="flex items-center gap-1 font-extrabold text-xl text-gray-900 dark:text-white select-none"
            >
              <span>Servi</span>
              <span className="text-primary">Toons</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSmallScreen;
