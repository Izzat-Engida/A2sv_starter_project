// app/auth/forgot-password/page.tsx
"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../../public/logo.svg";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Reset link sent to your email!");
      setResetSent(true);
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="A2SV Logo" width={120} height={80} priority />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Forgot your password?
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email and we'll send you a link to get back into your
          account.
        </p>

        {resetSent ? (
          <div className="text-center">
            <p className="mb-6 text-gray-600">
              If an account exists for {watch("email")}, you'll receive an email
              with reset instructions.
            </p>
            <Link href="/auth/signin">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Back to login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                error={errors.email?.message}
                className="w-full px-3 py-2 border-2 border-gray-200 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-sm shadow-sm hover:cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
