"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../../public/logo-blue.svg.png";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";


const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

async function updatePassword(token: string, newPassword: string) {
  const response = await fetch("https://a2sv-application-platform-backend-team8.onrender.com/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update password");
  }

  return response.json();
}

function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(token, data.password);
      toast.success("Password updated successfully!");
      setIsSuccess(true);
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="A2SV Logo" width={120} height={80} priority />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Set a new password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Please choose a strong, new password for your account.
        </p>

        {isSuccess ? (
          <div className="text-center">
            <p className="mb-6 text-gray-600">
              Your password has been updated successfully.
            </p>
            <Link href="/auth/signin-user">
              <Button className="w-full bg-[#4F46E5] hover:bg-[#4F46E5] text-white">
                Back to login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...register("password")}
                className={`w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:ring-1 ${errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                  }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              {!errors.password && touchedFields.password && (
                <div className="mt-2 text-sm text-gray-600">
                  <p className="font-medium">Password requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li
                      className={password?.length >= 8 ? "text-green-600" : ""}
                    >
                      At least 8 characters
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(password || "") ? "text-green-600" : ""
                      }
                    >
                      One uppercase letter
                    </li>
                    <li
                      className={
                        /[a-z]/.test(password || "") ? "text-green-600" : ""
                      }
                    >
                      One lowercase letter
                    </li>
                    <li
                      className={
                        /[0-9]/.test(password || "") ? "text-green-600" : ""
                      }
                    >
                      One number
                    </li>
                    <li
                      className={
                        /[^A-Za-z0-9]/.test(password || "")
                          ? "text-green-600"
                          : ""
                      }
                    >
                      One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className={`w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:ring-1 ${errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                  }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#4F46E5] hover:bg-[#4F46E5] text-white py-2 px-4 rounded-sm shadow-sm hover:cursor-pointer disabled:opacity-70"
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;