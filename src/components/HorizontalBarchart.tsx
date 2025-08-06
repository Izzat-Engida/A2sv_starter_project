'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HorizontalBar } from '@/types/globaltype';

type Props = {
  data: HorizontalBar;
};

function HorizontalBarchart({ data }: Props) {
  const prep = [
    { name: 'Applied', value: data.applied || 0 },
    { name: 'Under Review', value: data.in_progress || 0 },
    { name: 'Interview', value: data.interview || 0 },
    { name: 'Accepted', value: data.accepted || 0 },
  ];

  return (
    <div >
      <div className="flex flex-col">
        <p className="text-[20px] font-[600] leading-[2.8] text-center">Application Funnel</p>
        <p className="font-[400] text-[14px] leading-6 text-center">
          This chart visualizes the applicant&apos;s journey from submission to acceptance
        </p>
      </div>
      <div className="w-full h-[300px]">
        {prep.every((item) => item.value === 0) ? (
          <div className="text-gray-500 text-center">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={prep}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default HorizontalBarchart;