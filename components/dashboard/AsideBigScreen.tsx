"use client";
import { cn } from "@/lib/utils";
import { DashboardPages } from "@/utils/data";
import { CircleHelp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import AvatarUser from "../AvatarUser";
import { SwitchThemSmallScreen } from "../themes/SwitchTheme";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const AsideBigScreen = () => {
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
    <aside
      className="hidden lg:flex flex-col gap-4 max-w-80 border-r-2 h-full
     overflow-x-hidden overflow-y-auto transition-all duration-500 ease-in-out"
    >
      {/*  logo top*/}
      <div className="p-4 pt-8">
        {/* link logo */}
        <Link href={"/"}>
          <div className="font-bold text-lg flex items-center gap-1">
            <span>Servi</span>
            <span className="text-primary">Toons</span>
          </div>
        </Link>
      </div>

      {/* links nav */}
      <div className="flex-1 p-4 flex flex-col gap-4 border-y-2 transition-all duration-500 ease-in-out">
        <nav className="flex w-full flex-col gap-4">
          {DashboardPages.map((lk, idx) => (
            <Link href={lk.href} key={idx}>
              <div
                className={cn(
                  "w-full flex items-center gap-4 text-md p-2  rounded-lg",
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
          ))}
        </nav>
      </div>

      {/* bottom side */}
      <div className="flex flex-col p-4 gap-4 w-full">
        {/* help */}
        <Link href={"#"}>
          <div className="w-full flex items-center gap-4 text-md p-2 rounded-lg">
            <CircleHelp className="shrink-0 size-6" />
            <span>Aide</span>
          </div>
        </Link>

        <div className="w-full flex items-center gap-4 ">
          {/* theme */}
          <SwitchThemSmallScreen />

          {/* profil */}
          <Link href={"/profil"}>
            <AvatarUser />
          </Link>
        </div>

        {/* logout */}
        <Button
          variant={"destructive"}
          className="w-full"
          onClick={handleLogOut}
        >
          <span>Deconnexion</span>
        </Button>

        {/* footer */}
        <footer className="text-xs mt-4 opacity-75">
          <span>© SERVI TOONS. </span>
          <span>{new Date().getFullYear()}</span>
        </footer>
      </div>
    </aside>
  );
};

export default AsideBigScreen;
