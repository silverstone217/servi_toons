import { getUser } from "@/actions/authAction";
import AsideBigScreen from "@/components/dashboard/AsideBigScreen";
import HeaderSmallScreen from "@/components/dashboard/HeaderSmallScreen";
import { LogInToContinue } from "@/components/NotAuthorized";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getUser();

  //   if (user) {
  //     return <LogInToContinue />;
  //   }

  return (
    <div
      className="flex flex-col lg:flex-row lg:overflow-hidden w-full lg:h-screen
    transition-all duration-500 ease-in-out
    "
    >
      {/* header */}
      <HeaderSmallScreen />

      {/* aside */}
      <AsideBigScreen />

      {/* main */}
      <main
        className="flex-1 flex flex-col w-full h-full overflow-x-hidden lg:overflow-y-auto
      transition-all duration-500 ease-in-out"
      >
        {!user ? (
          <LogInToContinue />
        ) : (
          <main className="pt-20 lg:pt-8 px-4 pb-8 container mx-auto w-full transition-all duration-500 ease-in-out">
            {children}
          </main>
        )}
      </main>
    </div>
  );
}

export default DashboardLayout;
