import { Card } from "../../../components/ui/card";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import logo from "../../../../public/logo.svg";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md p-8  border-0  bg-white shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Image src={logo} alt="A2SV Logo" priority />
          </div>
          <h2 className="mt-2 text-2xl font-extrabold">Create a new account</h2>
          <p className="mt-1 text-sm text-gray-500">Select your account type</p>
        </div>

        <div className="mt-8 space-y-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/signup/applicant">Applicant Account</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full bg-blue-500 text-white"
          >
            <Link href="/auth/signup/admin">Admin Account</Link>
          </Button>
        </div>

        <div className="mt-6 text-center text-sm">
          <p>
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
