"use client";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import logo from "../../../../../public/logo.svg";

const signUpSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function RoleSignUpPage() {
  const params = useParams();
  const router = useRouter();
  const role = params["user-role"] as string;
  const emailRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setFocus,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    setFocus("fullName");
  }, [setFocus]);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await fetch(
        "https://a2sv-application-platform-backend-team8.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: data.fullName,
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.message?.includes("already exists")) {
          // Focus on email field if account exists
          emailRef.current?.focus();
          setError("email", {
            type: "manual",
            message: "An account with this email already exists",
          });
          toast.error("An account with this email already exists");
          return;
        }

        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof SignUpFormData, {
              type: "server",
              message: Array.isArray(messages)
                ? messages.join(" ")
                : String(messages),
            });
          });
          return;
        }
        throw new Error(result.message || "Registration failed");
      }

      if (result.success) {
        toast.success("Registration successful! Redirecting to sign in...");
        setTimeout(() => {
          router.push("/auth/SigninUser");
        }, 2000);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      console.error("Registration error:", error);
    }
  };

  return (
    <Card className="w-full border-0 max-w-md p-8 bg-white shadow-md">
      <div className="text-center mb-8">
        <div className="flex justify-center">
          <Image src={logo} alt="A2SV Logo" className="m-2" priority />
        </div>
        <h2 className="text-lg font-extrabold">Create a new {role} account</h2>
        <p className="text-sm text-gray-600 mt-1">
          Or{" "}
          <Link href="/auth/signin" className="text-blue-600 ">
            sign in with your account
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <Input
            placeholder="Full name"
            {...register("fullName")}
            className={`border-gray-200 border-2 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.fullName ? "border-red-500" : ""
            }`}
            aria-invalid={errors.fullName ? "true" : "false"}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <Input
            type="email"
            placeholder="Email address"
            {...register("email")}
            ref={(e) => {
              register("email").ref(e);
              emailRef.current = e;
            }}
            className={`border-gray-200 border-2 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : ""
            }`}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={`border-gray-200 border-2 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : ""
            }`}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <Input
            type="password"
            placeholder="Confirm your Password"
            {...register("confirmPassword")}
            className={`border-gray-200 border-2 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer"
          disabled={isSubmitting}
        >
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
              Creating account...
            </span>
          ) : (
            `Create ${role} account`
          )}
        </Button>
      </form>
    </Card>
  );
}
