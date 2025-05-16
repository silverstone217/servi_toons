import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div>
      {/* header */}
      <header>Header</header>
      <main>{children}</main>
      {/* aside */}
    </div>
  );
}

export default DashboardLayout;
