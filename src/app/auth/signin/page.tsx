'use client'
import { User } from '@/types/globaltype'
import React from 'react'
import { useForm} from 'react-hook-form'
import { signIn } from 'next-auth/react'

function SignIN() {
  const {register,handleSubmit,formState}=useForm<User>()
  const {errors}=formState
  return (
    <div className='text-white' onSubmit={handleSubmit(async(data:User)=>{
      const res=await signIn('credentials',{
        email:data.email,
        password:data.password,
        callbackUrl:"   ",///don't foeget to set this
        role:"",
      })
        //need help with the logic here so don't forget to correct it
    })}>
      asdkjnkjdsnf
      <form>

      <input type='text' {...register("email")}/> 
      <input type='text' {...register("password")}/>
      <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default SignIN
