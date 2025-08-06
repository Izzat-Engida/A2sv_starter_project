'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Applications, HorizontalBar } from '@/types/globaltype';
import HorizontalBarchart from './HorizontalBarchart';
import UniversityPieChart from './Piechart';
import VerticalBarGraph from './VerticalBarGraph';

function Analytics() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<Applications | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [barData, setBarData] = useState<HorizontalBar>({ in_progress: 0, accepted: 0, interview: 0, applied: 0 });

  useEffect(() => {
    const fetcher = async () => {
      if (status !== 'authenticated' || !session?.accessToken) {
        console.log('Session status:', status, 'AccessToken:', session?.accessToken);
        setError('You must be logged in to view analytics.');
        return;
      }

      try {
        const link = 'https://a2sv-application-platform-backend-team8.onrender.com/manager/applications';
        const res = await fetch(link, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch applications');
        }

        const fetchedData: Applications = await res.json();
        console.log('API Response:', fetchedData);
        setData(fetchedData);
        setError(null);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred while fetching applications');
      }
    };

    fetcher();
  }, [status, session]);

  useEffect(() => {
    if (!data?.data?.reviews) {
      setBarData({ in_progress: 0, accepted: 0, interview: 0, applied: data?.data.total_count || 0 });
      return;
    }

    const counts = {
      in_progress: 0,
      accepted: 0,
      interview: 0,
      applied: data.data.total_count || 0,
    };

    data.data.reviews.forEach((review) => {
      if (review.status === 'in_progress') {
        counts.in_progress += 1;
      } else if (review.status === 'accepted') {
        counts.accepted += 1;
      } else if (review.status === 'interview') {
        counts.interview += 1;
      }
    });

    setBarData({
      in_progress: counts.in_progress,
      accepted: counts.accepted,
      interview: counts.interview,
      applied: counts.applied,
    });
  }, [data]);

  if (status === 'loading') {
    return <div>Loading session...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className='text-center'>Loading applications...</div>;
  }

  return(
    
  <div className="p-4">
    <div>
    <h1 className=' font-bold text-[30px]'>Application Analytics</h1>
    <p>Insights </p>
    </div>
    <div className='flex flex-wrap gap-2'>
      <div>
        <p>Total Applicants</p>
      </div>
      <div>
        <p>Acceptance Rate</p>
      </div>
      <div>
        <p>Average review Time</p>
      </div>
    </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:gap-4">
          <div className="w-full md:w-1/2 shadow-lg rounded-lg bg-white p-4">
            <UniversityPieChart Applications={data} />
          </div>
          <div className="w-full md:w-1/2 shadow-lg rounded-lg bg-white p-4">
            <HorizontalBarchart data={barData} />
          </div>
        </div>
        <div className="w-full shadow-lg rounded-lg bg-white p-4">
          <VerticalBarGraph />
        </div>
      </div>
    </div>
  )
}

export default Analytics;