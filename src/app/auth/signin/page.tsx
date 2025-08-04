'use client'
import { User } from '@/types/globaltype'
import React from 'react'
import { useForm} from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {FaLock} from 'react-icons/fa'
function SignIN() {
  const {register,handleSubmit,formState}=useForm<User>()
  const {errors}=formState
  return (
    <div className='h-[25%] w-[50%]' >
      <div>
      <div>logo placment</div>
      <div className='text-[40px]'>Sign in to your account</div>
      <div className='text-[#4F46E5]'><span>Back to Home</span>|<span>Create a new applicant account</span></div>
      </div>
      <div>
      <form  onSubmit={handleSubmit(async(data:User)=>{
      const res=await signIn('credentials',{
        email:data.email,
        password:data.password,
        callbackUrl:"   ",///don't foeget to set this
        role:"",
      })
        //need help with the logic here so don't forget to correct it
    })}>
      <div>
      <div>
        <Input type="email" {...register("email")}/>
      </div>
      <div>
        <Input type="password" {...register("password")}/>
      </div>
      </div>
      <div className='flex justify-between my-[5px]'>
        <span><input type='checkbox'/> <span className='ml-[5px]'>Remember me</span></span>
       <span>Forgot your password?</span>
      </div>
      <Button className='w-[100%] bg-[#4F46E5] flex justify-between :hover:bg-[#4F46E5] text-white'><span>
        <FaLock/>
        </span><span>Sign in</span>
        <span className='opacity-0'>/</span>
        </Button>
      </form>
      </div>
    </div>
  )
}

export default SignIN
