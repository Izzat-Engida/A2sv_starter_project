'use client'
import React, { useEffect, useState } from 'react'
import { Cycles } from '@/types/globaltype'
import { CycleCard } from './CycleCard';
import { useSession } from 'next-auth/react';
import type { Session as NextAuthSession } from 'next-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
function Cycl() {
  const { data: session, status } = useSession() as {
    data: NextAuthSession | null;
    status: 'authenticated' | 'loading' | 'unauthenticated';
  };
  const [data, setData] = useState<Cycles>();
  const router = useRouter()

  useEffect(() => {
    if (status !== 'authenticated' || !session?.accessToken) {
      console.log('Session status:', status, 'AccessToken:', session?.accessToken);
      return;
    }

    const link = 'https://a2sv-application-platform-backend-team8.onrender.com/cycles';
    const func = async () => {
      const res = await fetch(link, {
        method: 'GET',
      })
      const hold = await res.json()
      console.log(hold)
      if (!res.ok) {
        throw new Error(hold.message || 'Failed to fetch cycles')
      }
      setData(hold)
    }
    func()
  }, [session?.accessToken, status])
  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full">

      <div className="flex flex-col sm:flex-row justify-between items-center py-4">
        <h2 className="text-lg font-semibold text-center sm:text-left">Application Cycles</h2>
        <Button className="mt-2 sm:mt-0" onClick={() => { router.push('/dashboard/admin/admincycles/createcycles') }}>Create Cycle</Button>
      </div>


      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {data?.data.cycles.map((dat, index) => (
            <CycleCard key={index} cycle={dat} />
          ))}
        </div>
      </div>
    </div>

  )
}

export default Cycl
