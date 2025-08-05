// src/app/components/layout/Header/variants/AdminHeader.tsx
"use client";

import { BaseHeader } from "../BaseHeader";

export const AdminHeader = () => (
  <BaseHeader
    variant="admin"
    navItems={[
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/cycles", label: "Cycles" },
      { href: "/admin/users", label: "Users" },
    ]}
    className="admin-header"
  />
);
