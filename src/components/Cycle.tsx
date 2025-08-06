'use client'
import React, { useEffect,useState } from 'react'
import { Cycles } from '@/types/globaltype'
import { CycleCard } from './CycleCard';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
function Cycl() {
    const {data:session,status}=useSession()
    const [data,setData]=useState<Cycles>();
    const dummyData: Cycles = {
  success: true,
  data: {
    cycles: [
      {
        id: 1,
        name: "G7 Cycle",
        start_date: "2025-01-01",
        end_date: "2025-03-31",
        is_active: true,
        created_at: "2024-12-15T12:00:00Z",
      },
      {
        id: 2,
        name: "Cycle 2",
        start_date: "2025-04-01",
        end_date: "2025-06-30",
        is_active: false,
        created_at: "2025-03-10T12:00:00Z",
      },
      {
        id: 3,
        name: "Cycle 3",
        start_date: "2025-07-01",
        end_date: "2025-09-30",
        is_active: false,
        created_at: "2025-06-10T12:00:00Z",
      },
    ],
    total_count: 3,
    page: 1,
    limit: 10,
  },
  message: "Dummy data loaded successfully",
};

useEffect(()=>{
    // if (status !== 'authenticated' || !session?.accessToken) {
    //     console.log('Session status:', status, 'AccessToken:', session?.accessToken);
    //     return;
    // }
    const cond=true
    if(cond){
        setData(dummyData)
        return
    }
    const link = 'https://a2sv-application-platform-backend-team8.onrender.com/cycles';
    const func=async()=>{
        const res=await fetch(link,{
            method:'GET',
        })
        const hold=await res.json()
        console.log(hold)
        if(!res.ok){
            throw new Error(hold.message || 'Failed to fetch cycles')
        }
        setData(hold)
    }
    func()
},[session?.accessToken,status])
  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full">
  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-center py-4">
    <h2 className="text-lg font-semibold text-center sm:text-left">Application Cycles</h2>
    <Button className="mt-2 sm:mt-0">Create Cycle</Button>
  </div>

  {/* Cards Grid */}
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
