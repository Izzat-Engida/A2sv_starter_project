import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import Provider from "../providers/AuthProvider";

export const metadata: Metadata = {
  title: "A2SV - Sign Up",
  description: "Create a new applicant account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
