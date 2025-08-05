// src/app/components/layout/Layout.tsx
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader, ApplicantHeader } from "./Header/variants";
import { BaseFooter } from "../layout/Footer/BaseFooter";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();

  // Determine which header to use
  const getHeader = () => {
    if (pathname?.startsWith("/admin/cycles")) return <AdminHeader />;
    if (pathname?.startsWith("/applicant/dashboard"))
      return <ApplicantHeader isDashboard />;
    if (pathname?.startsWith("/applicant/form")) return <ApplicantHeader />;
  };

  return (
    <div className="app-layout">
      {getHeader()}
      <main className="app-main">{children}</main>
      {<BaseFooter variant="full" />}
    </div>
  );
};
