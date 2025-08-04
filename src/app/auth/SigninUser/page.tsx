'use client'
import { User } from '@/types/globaltype'
import React from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FaLock } from 'react-icons/fa'
import path from '../../../../public/images/logo-blue.svg fill.svg'

function SigninUser() {
  const { register, handleSubmit, formState } = useForm<User>()
  const { errors } = formState

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img src={path.src} alt="A2sv image" className="h-16" />
        </div>
        <div className="text-2xl font-semibold text-center mb-2">
          Sign in to your account
        </div>
        <div className="text-sm text-[#4F46E5] text-center mb-6">
          <span className="cursor-pointer">Back to Home</span> | <span className="cursor-pointer">Create a new applicant account</span>
        </div>
        <form onSubmit={handleSubmit(async (data: User) => {
          await signIn('credentials', {
            email: data.email,
            password: data.password,
            callbackUrl: "/", // Set your callback URL here
            role: "user",
          })
        })}>
          <div className="space-y-4">
            <Input type="email" placeholder="Email" {...register("email")} />
            <Input type="password" placeholder="Password" {...register("password")} />
          </div>
          <div className="flex justify-between items-center my-4 text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <span className="text-[#4F46E5] cursor-pointer">Forgot your password?</span>
          </div>
          <Button className="w-full bg-[#4F46E5] hover:bg-[#4F46E5] text-white flex items-center justify-center space-x-2">
            <FaLock />
            <span>Sign in</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

export default SigninUser
