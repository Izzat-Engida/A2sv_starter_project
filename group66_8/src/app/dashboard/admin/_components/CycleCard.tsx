'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cycle } from '@/types/globaltype';
import { useSession } from 'next-auth/react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useToast } from '@/components/ui/use-toast'; 

interface Props {
  cycle: Cycle;
}

export function CycleCard({ cycle }: Props) {


  const session = useSession()



  const getRandomHexColor = () => {
    const r = Math.floor(Math.random() * 100);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleClose = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const link_activate = `https://a2sv-application-platform-backend-team8.onrender.com/admin/cycles/${cycle.id}/activate`
    const link_deactivate = `https://a2sv-application-platform-backend-team8.onrender.com/admin/cycles/${cycle.id}/deactivate`
    const res = await fetch(cycle.is_active ? link_deactivate : link_activate, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session.data?.accessToken}`
      }
    })
    if (!res.ok) {
      const err = await res.json()
      console.error(err.message)
      return
    }
    window.location.reload();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mb-4 w-full max-w-md cursor-pointer">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{cycle.name}</h3>
        <Button
          onClick={handleClose}
          aria-label={`Close cycle ${cycle.name}`}
          // style={{ backgroundColor: getRandomHexColor() }}
          className='bg-[#4F46E5]'
        >
          {cycle.is_active ? <span>close</span> : <span>open</span>}
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="block text-sm font-medium text-gray-600">Country</span>
          <span className="block text-base font-semibold text-gray-800">Ethiopia</span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-600">Status</span>
          <span
            className={`block text-base font-semibold ${cycle.is_active ? 'text-green-600' : 'text-gray-500'
              }`}
          >
            {cycle.is_active ? 'Active' : 'Closed'}
          </span>
        </div>
      </div>
    </div>
  );
}
