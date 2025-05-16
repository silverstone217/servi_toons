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
      className="flex flex-col lg:flex-row lg:h-dvh lg:overflow-hidden
     transition-all duration-500 ease-in-out"
    >
      {/* header */}
      <HeaderSmallScreen />
      <AsideBigScreen />
      <main
        className="transition-all duration-500 lg:flex-1
      ease-in-out lg:h-full lg:overflow-x-hidden lg:overflow-y-auto"
      >
        <div className="lg:pt-8 px-4 pb-4 mx-auto max-w-7xl pt-20">
          {!user ? <LogInToContinue /> : children}
        </div>
      </main>
      {/* aside */}
    </div>
  );
}

export default DashboardLayout;
