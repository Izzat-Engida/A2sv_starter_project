"use client";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Logo } from "@/lib";

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = (password: string) => {
    let score = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password),
      password.length >= 12,
    ];

    score = checks.filter(Boolean).length;

    if (score <= 2) return { level: "weak", color: "bg-red-500", text: "Weak" };
    if (score <= 4) return { level: "fair", color: "bg-yellow-500", text: "Fair" };
    if (score <= 5) return { level: "good", color: "bg-[#352dd8]", text: "Good" };
    return { level: "strong", color: "bg-green-500", text: "Strong" };
  };

  const strength = getStrength(password);
  const checks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-all ${i <= checks.filter(c => c.met).length
                ? strength.color
                : "bg-gray-200"
                }`}
            />
          ))}
        </div>
        <span className={`text-xs font-medium ${strength.level === "weak" ? "text-red-600" :
          strength.level === "fair" ? "text-yellow-600" :
            strength.level === "good" ? "text-[#352dd8]" :
              "text-green-600"
          }`}>
          {strength.text}
        </span>
      </div>
      <div className="space-y-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {check.met ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-red-500" />
            )}
            <span className={check.met ? "text-green-600" : "text-gray-500"}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


const signUpSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required").min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .refine((email) => {
        // Check for common email patterns
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }, "Please enter a valid email address")
      .refine((email) => {
        // Check for common disposable email domains
        const disposableDomains = [
          'tempmail.com', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com',
          'mailinator.com', 'yopmail.com', 'throwaway.email', 'fakeinbox.com'
        ];
        const domain = email.split('@')[1];
        return !disposableDomains.includes(domain);
      }, "Please use a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
      .refine((password) => {
        // Check for common weak passwords
        const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
        return !weakPasswords.includes(password.toLowerCase());
      }, "This password is too common, please choose a stronger one"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function RoleSignUpPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setFocus,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange", // Enable real-time validation
  });

  const watchedPassword = watch("password");

  useEffect(() => {
    setFocus("fullName");
  }, [setFocus]);

  useEffect(() => {
    setPassword(watchedPassword || "");
  }, [watchedPassword]);

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
          router.push("/auth/signin-user");
        }, 2000);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-10">
      <Card className="w-full border-0 max-w-md p-8 bg-white shadow-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Image src={Logo} alt="A2SV Logo" className="m-2" priority />
          </div>
          <h2 className="text-lg font-extrabold">Create a new account</h2>
          <p className="text-sm text-gray-600 mt-1">
            Or{" "}
            <Link href="/auth/signin-user" className="text-[#352dd8] ">
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
              className={`border-gray-200 border-2 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-[#352dd8] ${errors.fullName ? "border-red-500" : ""
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
              className={`border-gray-200 border-2 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-[#352dd8] ${errors.email ? "border-red-500" : ""
                }`}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-red-500 text-xs flex items-center mt-1">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.email.message}
              </p>
            )}
            {!errors.email && watch("email") && (
              <p className="text-green-500 text-xs flex items-center mt-1">
                <Check className="w-3 h-3 mr-1" />
                Valid email format
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
              className={`border-gray-200 border-2 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-[#352dd8] ${errors.password ? "border-red-500" : ""
                }`}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {password && <PasswordStrengthIndicator password={password} />}
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
              className={`border-gray-200 border-2 bg-white rounded-sm focus:outline-none focus:ring-1 focus:ring-[#352dd8] ${errors.confirmPassword ? "border-red-500" : ""
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
            className="w-full mt-6 bg-[#352dd8] hover:bg-[#352dd8] text-white hover:cursor-pointer"
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
              "Create Account"
            )}
          </Button>

          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <h4 className="text-sm font-medium text-[#352dd8] mb-2">Password Requirements:</h4>
            <ul className="text-xs text-[#352dd8] space-y-1">
              <li>• Minimum 8 characters (12+ recommended)</li>
              <li>• Must contain uppercase and lowercase letters</li>
              <li>• Must contain at least one number</li>
              <li>• Must contain at least one special character</li>
              <li>• Avoid common passwords like "password123"</li>
            </ul>
          </div>
        </form>
      </Card>
    </div>
  );
}
