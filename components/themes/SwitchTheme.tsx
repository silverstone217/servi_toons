"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export const SwitchThemSmallScreen = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant={"outline"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Moon className={`h-6 w-6 transition-all duration-300 ease-in-out `} />
      ) : (
        <Sun className={`h-6 w-6  transition-all duration-300 ease-in-out `} />
      )}
      <span className={`text-sm sr-only`}>
        {theme === "dark" ? "Sombre" : "Claire"}
      </span>
    </Button>
  );
};
