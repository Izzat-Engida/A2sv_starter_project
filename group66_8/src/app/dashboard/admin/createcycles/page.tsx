'use client'
import { useForm } from 'react-hook-form'
import { ncycle } from '@/types/globaltype'
import { useSession } from 'next-auth/react'
import type { Session as NextAuthSession } from 'next-auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CycleForm() {
  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm<ncycle>()
  const session = useSession() as {
    data: NextAuthSession | null;
    status: 'authenticated' | 'loading' | 'unauthenticated';
  }
  const router = useRouter()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      window.location.href = '/auth/sign_in_admin'
    }
  }, [session.status])

  const onSubmit = async (data: ncycle) => {
    console.log('Form submitted:', data)
    const link = "https://a2sv-application-platform-backend-team8.onrender.com/admin/cycles"
    const res = await fetch(link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${session.data?.accessToken}`
      },
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('Failed to create cycle:', err.message)
      return
    }

    console.log('Cycle created successfully')
    reset()
    router.push('/admincycles')
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col justify-start px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md">
        <div className='justify-start'>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4">
            Create a New Cycle
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Use this form to create a new cycle and assign periods.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cycle Name</label>
            <Input
              type="text"
              placeholder="G6 November 2024"
              className="w-full"
              {...register("name", { required: "Cycle name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <Input
              type="date"
              className="w-full"
              {...register("start_date", { required: "Start date is required" })}
            />
            {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <Input
              type="date"
              className="w-full"
              {...register("end_date", {
                required: "End date is required",
                validate: (value) =>
                  value > getValues('start_date') || 'End date must be after start date'
              })}
            />
            {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>}
          </div>
          <div className='flex justify-end'>
            <Button
              type="submit"
              className="w-auto py-3 text-lg rounded-lg bg-[#4F46E5] hover:bg-blue-950"
            >
              Submit Cycle
            </Button>
            <Button
              onClick={() => router.push('/admincycles')}
              className='w-auto py-3 px-10 ml-5 text-lg rounded-lg text-black bg-white border border-black hover:bg-gray-100'
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
