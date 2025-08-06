// src/app/components/layout/Header/BaseHeader.tsx
"use client";

import React from "react";
import Link from "next/link";

type HeaderProps = {
  variant?:
    | "default"
    | "admin"
    | "applicant"
    | "confirmation"
    | "landing"
    | "login"
    | "manager";
  logoUrl?: string;
  navItems?: Array<{ href: string; label: string }>;
  user?: { name: string; role: string } | null;
  onLogin?: () => void;
  onLogout?: () => void;
  className?: string;
  children?: React.ReactNode;
};

export const BaseHeader = ({
  variant = "default",
  logoUrl = "/",
  navItems = [],
  user = null,
  onLogin,
  onLogout,
  className = "",
  children,
}: HeaderProps) => {
  return (
    <header className={`header ${variant} ${className}`}>
      <div className="header-container">
        <div className="header-logo">
          <Link href={logoUrl}>
            <a className="logo-link">{/* Your logo here */}</a>
          </Link>
        </div>

        <nav className="header-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.href} className="nav-item">
                <Link href={item.href}>
                  <a className="nav-link">{item.label}</a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <span className="user-greeting">Hello, {user.name}</span>
              <button onClick={onLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <button onClick={onLogin} className="login-button">
              Login
            </button>
          )}
        </div>

        {children}
      </div>
    </header>
  );
};
