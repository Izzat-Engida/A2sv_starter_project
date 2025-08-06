// src/app/components/layout/Header/variants/ApplicantHeader.tsx
"use client";

import { BaseHeader } from "../BaseHeader";

export const ApplicantHeader = ({ isDashboard = false }) => (
  <BaseHeader
    variant="applicant"
    navItems={
      isDashboard
        ? [
            { href: "/applicant/dashboard", label: "Dashboard" },
            { href: "/applicant/profile", label: "Profile" },
          ]
        : [{ href: "/applicant/form", label: "Application Form" }]
    }
    className="applicant-header"
  />
);
