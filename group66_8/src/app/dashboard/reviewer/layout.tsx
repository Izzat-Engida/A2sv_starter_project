import { BaseFooter } from "@/components/Footer";
import ReviewerNav from "@/components/ReviewerNav";
export const metadata = { title: "Admin Page" }


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
        <ReviewerNav />
        <main className="flex-1">
          {children}
        </main>
        <BaseFooter />
      </body>
    </html>
  );
}

