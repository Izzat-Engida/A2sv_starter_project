import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function VerticalBarGraph() {
  const dummyGeoData = [
    { country: 'Ethiopia', applicants: 120 },
    { country: 'Kenya', applicants: 80 },
    { country: 'Nigeria', applicants: 150 },
    { country: 'Ghana', applicants: 60 },
    { country: 'Uganda', applicants: 70 },
  ];

  return (
    <div>
      <h1 className="text-[20px] font-[600] leading-[2.8] text-center">Geographic Distribution</h1>
      <p className="text-[14px] font-[400] text-center mb-4">
        Shows the number of applicants from each country
      </p>
      <div className="w-full h-[300px]">
        {dummyGeoData.length === 0 ? (
          <div className="text-gray-500 text-center">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dummyGeoData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applicants" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default VerticalBarGraph;
