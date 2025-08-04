"use client";
import { User } from "@/types/globaltype";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import logo from "../../../../public/logo.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function SigninUser() {
  const { register, handleSubmit, formState, setValue } = useForm<User>({
    mode: "onBlur",
  });
  const { errors, isSubmitting } = formState;
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  // Load saved credentials if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail) setValue("email", savedEmail);
    if (savedPassword) setValue("password", savedPassword);
  }, [setValue]);

  const onSubmit = async (data: User & { rememberMe?: boolean }) => {
    setLoginError("");
    try {
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
        localStorage.setItem("rememberedPassword", data.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard",
        role: "user",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      } else if (result?.ok) {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage = error.message || "Login failed. Please try again.";
      setLoginError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="A2SV Logo" width={120} height={80} priority />
        </div>
        <h1 className="text-2xl font-semibold text-center mb-2">
          Sign in to your account
        </h1>
        <div className="text-sm text-[#4F46E5] text-center mb-6">
          <Link href="/" className="hover:underline">
            Back to Home
          </Link>{" "}
          |{" "}
          <Link href="/auth/signup" className="hover:underline">
            Create a new account
          </Link>
        </div>

        {loginError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className={`w-full px-3 py-2 border-2 border-gray-200 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full px-3 py-2 border-2 border-gray-200 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center my-4 text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 text-[#4F46E5] rounded border-gray-300 focus:ring-[#4F46E5]"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[#4F46E5] hover:underline hover:cursor-pointer"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4F46E5] hover:bg-[#4F46E5]/90 hover:cursor-pointer text-white"
            disabled={isSubmitting}
          >
            <FaLock className="mr-2" />
            {isSubmitting ? (
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
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SigninUser;
