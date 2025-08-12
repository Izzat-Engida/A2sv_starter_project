
"use client";
import AdminNav from "@/components/AdminNav";
import ReviewerNav from "@/components/ReviewerNav";
import ManagerNav from "@/components/ManagerNav";
import ApplicantNav from "@/components/ApplicantNav";
import { BaseFooter } from "@/components/Footer";
import { useSession } from "next-auth/react";

// export const metadata = { title: "Profile Page" };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, status } = useSession();
    let role = (session?.user as any)?.role || (session as any)?.role;
    role = typeof role === "string" ? role.toLowerCase() : undefined;
    let NavComponent = null;
    if (role === "admin") NavComponent = <AdminNav />;
    else if (role === "reviewer") NavComponent = <ReviewerNav />;
    else if (role === "manager") NavComponent = <ManagerNav />;
    else if (role === "applicant") NavComponent = <ApplicantNav />;

    return (
        <html lang="en">
            <body className="bg-gray-100 min-h-screen flex flex-col">
                {NavComponent}
                <main className="flex-1">{children}</main>
                <BaseFooter />
            </body>
        </html>
    );
}
