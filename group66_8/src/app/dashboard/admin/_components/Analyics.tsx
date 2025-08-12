// eslint-disable-next-line @typescript-eslint/no-explicit-any
'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import UniversityPieChart from './Piechart';
import HorizontalBarchart from './HorizontalBarChart';
import VerticalBarGraph from './VerticalBarGraph';

interface ApplicationFunnel {
  submitted: number;
  accepted: number;
  pending_review: number;
  in_progress: number;
}

interface SchoolDistribution {
  [schoolName: string]: number;
}

interface CountryDistribution {
  [countryName: string]: number;
}

interface AnalyticsData {
  total_applicants: number;
  acceptance_rate: number;
  average_review_time_days: number;
  application_funnel: ApplicationFunnel;
  school_distribution: SchoolDistribution;
  country_distribution: CountryDistribution;
}

interface ApiResponse {
  success: boolean;
  data: AnalyticsData;
  message: string;
}

function Analytics() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      if (status !== 'authenticated' || !session?.accessToken) {
        setError('You must be logged in to view analytics.');
        return;
      }

      try {
        const link = 'https://a2sv-application-platform-backend-team8.onrender.com/admin/analytics';
        const res = await fetch(link, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch analytics');
        }

        const fetchedData: ApiResponse = await res.json();
        console.log(fetchedData)
        if (fetchedData.success) {
          setData(fetchedData.data);
          setError(null);
        } else {
          setError(fetchedData.message || 'Failed to fetch analytics');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching analytics');
      }
    };

    fetcher();
  }, [status, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen p-4 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4F46E5] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <div className="text-red-500 text-center">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen p-4 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4F46E5] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }


  const funnelData = {
    submitted: data.application_funnel.submitted,
    in_progress: data.application_funnel.in_progress,
    interview: data.application_funnel.pending_review,
    accepted: data.application_funnel.accepted,
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="flex-1">
        <div>
          <h1 className="font-bold text-[30px] mb-1">Application Analytics</h1>
          <p>Insights for G7</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pb-4">
          <div className="bg-white p-4 w-full sm:w-full md:w-1/3 max-w-xs shadow-lg rounded-lg text-center">
            <p>Total Applicants</p>
            <p className='font-[600] text-[30px]'>{data.total_applicants}</p>
          </div>
          <div className="bg-white p-4 w-full sm:w-full md:w-1/3 max-w-xs shadow-lg rounded-lg text-center">
            <p>Acceptance Rate</p>
            <p className='font-[600] text-[30px]'>{data.acceptance_rate.toFixed(2)}%</p>
          </div>
          <div className="bg-white p-4 w-full sm:w-full md:w-1/3 max-w-xs shadow-lg rounded-lg text-center">
            <p>Average Review Time</p>
            <p className='font-[600] text-[30px]'>{data.average_review_time_days} days</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="w-full md:w-1/2 shadow-lg rounded-lg bg-white p-4">
              <UniversityPieChart schoolDistribution={data.school_distribution} />
            </div>
            <div className="w-full md:w-1/2 shadow-lg rounded-lg bg-white p-4">
              <HorizontalBarchart data={funnelData} />
            </div>
          </div>
          <div className="w-full shadow-lg rounded-lg bg-white p-4">
            <VerticalBarGraph
              data={Object.entries(data.country_distribution).map(([country, applicants]) => ({
                country,
                applicants,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
