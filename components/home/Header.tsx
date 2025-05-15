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

function Header() {
  const user = useCurrentUser();

  return (
    <header className="transition-all ease-in-out duration-500">
      {/* container */}
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

        {/* rigth side */}
        <aside className="flex items-center gap-6 justify-start">
          {/* nav links */}
          <div className=" hidden lg:flex items-center gap-4 justify-start">
            {HomeLinksPage.map((lk, i) => (
              <Link href={lk.href} key={i}>
                <div
                  className="font-medium hover:underline underline-offset-2 
                transition-all ease-in-out duration-500 shrink-0"
                >
                  <span>{lk.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* other btns and login */}
          <div className="flex items-center gap-3 justify-start">
            {/* search */}
            <Button variant={"outline"}>
              <Search />
            </Button>

            {/* Theme */}
            <SwitchThemSmallScreen />

            {/* History */}
            {/* <Button variant={"outline"}>
              <History />
            </Button> */}

            {/* login */}

            {/* sign */}
            {!user ? (
              <Link href={"/connexion"} className="lg:block hidden">
                <Button>
                  <span>Connexion</span>
                </Button>
              </Link>
            ) : (
              <ProfileMenuBigScreen />
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}

export default Header;
