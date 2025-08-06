import React from 'react'
import { useForm } from 'react-hook-form'
import User from '../../../../types/globaltype'
function Signup() {
    const {register,handleSubmit}=useForm<User>()
  return (
    <div>
      <form>
        <input type="text" {...register("full_name")}/>
        <input type="text" {...register("email")}/>
        <input type="text" {...register("password")}/>
        <button>submit</button>
      </form>
    </div>
  )
}

export default Signup
