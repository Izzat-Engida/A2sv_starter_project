"use client";
import { User } from "@/types/globaltype";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getSession, signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaLock } from "react-icons/fa";
import { Logo } from "@/lib";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function SigninUser() {
  const { register, handleSubmit, formState } = useForm<User>();
  const router=useRouter()
  const { errors } = formState;
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: User) => {
    setError(null);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      role: "user",
      rememberme: rememberMe,
      redirect: false,
      callbackUrl: "/",
    });

    if (res?.error) {
      setError(res.error);
      console.error("Sign-in error:", res.error);
    } else {
      const session = await getSession();
      if(session?.role==='applicant'){
        router.push('/dashboard/applicant')
      }
      else if(session?.role==='manager'){
       router.push('/dashboard/manager')   
      }
      else if(session?.role==='reviewer'){
        router.push('/dashboard/reviewer')
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="A2sv image" className="h-16" />
        </div>
        <div className="text-2xl font-semibold text-center mb-2">
          Sign in to your account
        </div>
        <div className="text-sm text-[#4F46E5] text-center mb-6">
          <span className="cursor-pointer">Back to Home</span> |{" "}
          <span className="cursor-pointer">Create a new applicant account</span>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <Input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-between items-center my-4 text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <span className="text-[#4F46E5] cursor-pointer">
              <Link href="/auth/forgot-password">
              Forgot your password?
              </Link>
            </span>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#4F46E5] hover:bg-[#4F46E5] text-white flex items-center justify-center space-x-2"
          >
            <FaLock />
            <span>Sign in</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SigninUser;
