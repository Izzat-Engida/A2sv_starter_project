'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cycle } from '@/types/globaltype';
import { useSession } from 'next-auth/react';
import type { Session as NextAuthSession } from 'next-auth';
interface Props {
  cycle: Cycle;
}

export function CycleCard({ cycle }: Props) {
  const session = useSession() as {
    data: NextAuthSession | null;
    status: 'authenticated' | 'loading' | 'unauthenticated';
  };
  const getRandomHexColor = () => {
    const r = Math.floor(Math.random() * 100);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return `rgb(${r}, ${g}, ${b})`;
  };


  const handleClose = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to close the cycle: ${cycle.name}?`);
    if (!confirmDelete) return;
    console.log("Session:", session);

    const link = `https://a2sv-application-platform-backend-team8.onrender.com/admin/cycles/${cycle.id}`;
    console.log(cycle.name)
    const res = await fetch(link, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${session.data?.accessToken}`,
      },
    });
    console.log(cycle.id)
    if (!res.ok) {
      alert('Failed to close cycle');
      return;
    }

    alert('Cycle closed successfully');
    window.location.reload();

  };


  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mb-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{cycle.name}</h3>
        <Button

          onClick={handleClose}
          aria-label={`Close cycle ${cycle.name}`}
          style={{ backgroundColor: getRandomHexColor() }}
        >
          Close
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="block text-sm font-medium text-gray-600">Country</span>
          <span className="block text-base font-semibold text-gray-800">
            {"Ethiopia"}
          </span>
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
