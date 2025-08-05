"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/logo.svg";

type FooterProps = {
  variant?: "full" | "minimal";
  className?: string;
};

const footerLinks = {
  Solutions: [
    { href: "#", label: "Student Training" },
    { href: "#", label: "Corporate Partnership" },
  ],
  Support: [
    { href: "#", label: "Contact Us" },
    { href: "#", label: "FAQ" },
  ],
  Company: [
    { href: "#", label: "About" },
    { href: "#", label: "Blog" },
  ],
  Legal: [
    { href: "#", label: "Privacy" },
    { href: "#", label: "Terms" },
  ],
};

export const BaseFooter = ({
  variant = "full",
  className = "",
}: FooterProps) => {
  return (
    <footer className={`bg-[#111827] text-white px-6 py-10 ${className}`}>
      {variant === "full" && (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          {/* Logo and Description */}
          <div className="md:w-1/4">
            <div className="flex items-center gap-2 mb-3">
              <Image src={logo} alt="A2SV Logo" width={100} height={60} />
            </div>
            <p className="text-sm text-gray-400">
              Preparing Africa's top tech talent for global opportunities.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-12">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase">
                  {section}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>
                        <span className="text-sm text-gray-400 hover:text-white cursor-pointer">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Copyright */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} A2SV. All rights reserved.
      </div>
    </footer>
  );
};
