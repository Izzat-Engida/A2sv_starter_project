'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Session as NextAuthSession } from 'next-auth';
import { Applications, Applicantion } from '@/types/globaltype';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Props = {
  Applications: Applications;
};

function UniversityPieChart({ Applications }: Props) {
  const { data: session, status } = useSession() as {
    data: NextAuthSession | null;
    status: 'authenticated' | 'loading' | 'unauthenticated';
  };
  const [universityCount, setUniversityCount] = useState<{ name: string; value: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const useDummyData = true;

    if (useDummyData) {
      const dummyUniversityCount = [
        { name: 'Addis Ababa University', value: 50 },
        { name: 'ASTU', value: 30 },
        { name: 'Mekelle University', value: 20 },
        { name: 'Bahir Dar University', value: 15 },
        { name: 'Hawassa University', value: 10 },
      ];
      setUniversityCount(dummyUniversityCount);
      setError(null);
      return;
    }

    if (status !== 'authenticated' || !session?.accessToken) {
      console.log('Session status:', status, 'AccessToken:', session?.accessToken);
      return;
    }

    const fetchAllApplications = async () => {
      try {
        if (!Applications?.data?.reviews?.length) {
          setError('No application reviews available');
          return;
        }

        const fetchPromises = Applications.data.reviews.map((review) =>
          fetch(`https://a2sv-application-platform-backend-team8.onrender.com/manager/applications/${review.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
          }).then(async (res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch application ${review.id}: ${res.statusText}`);
            }
            return res.json();
          })
        );

        const applicationDetails: Applicantion[] = await Promise.all(fetchPromises);

        const universityMap: { [key: string]: number } = {};

        applicationDetails.forEach((app) => {
          const university = app?.data?.school;
          if (university) {
            universityMap[university] = (universityMap[university] || 0) + 1;
          }
        });

        const pieData = Object.entries(universityMap).map(([name, value]) => ({ name, value }));
        setUniversityCount(pieData);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load university data. Please try again later.');
      }
    };

    fetchAllApplications();
  }, [Applications, session, status]);


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1'];

  return (
    <div>
      <div>
        <p className="font-semibold text-[20px] leading-[2.8] text-[600]">University Distribution</p>
        <p className="text-[400] text-[16px] leading-[2.0]">Breakdown of applicants by their university</p>
      </div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : universityCount.length === 0 ? (
        <div className="text-gray-500">No university data available</div>
      ) : (
        <div className="w-full h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={universityCount}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label
              >
                {universityCount.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default UniversityPieChart;
