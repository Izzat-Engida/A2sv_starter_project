// app/page.tsx
import { Button } from "../components/ui/button";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.svg";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6 text-center bg-white p-8 rounded-lg shadow-sm">
        <div className="flex justify-center">
          <Image
            src={logo}
            alt="A2SV Logo"
            width={120}
            height={80}
            priority
            className="h-20 w-auto"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to A2SV</h1>
        <p className="text-gray-600 text-sm">
          Application and recruitment platform
        </p>

        <div className="flex flex-col space-y-4 pt-8">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            <Link href="/auth/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
