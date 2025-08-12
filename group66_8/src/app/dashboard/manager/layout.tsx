import AdminNav from "@/components/AdminNav";
import ApplicantNav from "@/components/ApplicantNav";
import { BaseFooter } from "@/components/Footer";
import ManagerNav from "@/components/ManagerNav";


export const metadata = { title: "Manager Page" }


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className="bg-gray-100 min-h-screen flex flex-col"
            >
                <ManagerNav />
                <main className="flex-1">
                    {children}
                </main>
                <BaseFooter />
            </body>
        </html>
    );
}
