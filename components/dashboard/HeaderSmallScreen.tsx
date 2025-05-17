"use client";
import React from "react";
import SmallScreenNavMenu from "../dashboard/SmallScreenNavMenu";
import Link from "next/link";

const HeaderSmallScreen = () => {
  return (
    <header
      className="lg:hidden transition-all ease-in-out duration-500 
    bg-background fixed top-0 right-0 left-0 shadow z-50"
    >
      <div
        className="p-4 flex items-center justify-between gap-6 
      transition-all ease-in-out duration-500"
      >
        {/* left part */}
        <aside className="flex items-center gap-3 justify-start">
          {/* icon menu */}
          <div className="lg:hidden">
            <SmallScreenNavMenu />
          </div>

          {/* link logo */}
          <Link href={"/"}>
            <div className="font-bold text-lg flex items-center gap-1">
              <span>Servi</span>
              <span className="text-primary">Toons</span>
            </div>
          </Link>
        </aside>
      </div>
    </header>
  );
};

export default HeaderSmallScreen;
