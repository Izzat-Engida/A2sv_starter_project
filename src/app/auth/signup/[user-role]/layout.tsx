// src/app/auth/signup/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../../../app/globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A2SV - Sign Up",
  description: "Create a new applicant account",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {children}
    </main>
  );
}
