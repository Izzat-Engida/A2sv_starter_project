'use client';
import React from 'react';
import { Button } from './ui/button';
import { Cycle } from '@/types/globaltype';

interface Props {
  cycle: Cycle;
}

export function CycleCard({ cycle }: Props) {
  
  const handleClose = () => {
    
    console.log(`Closing cycle: ${cycle.name}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mb-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{cycle.name}</h3>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClose}
          aria-label={`Close cycle ${cycle.name}`}
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
            className={`block text-base font-semibold ${
              cycle.is_active ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {cycle.is_active ? 'Active' : 'Closed'}
          </span>
        </div>
      </div>
    </div>
  );
}