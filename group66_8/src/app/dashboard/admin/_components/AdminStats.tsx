'use client';

import React from 'react';
import { useGetCycleQuery } from '@/lib/redux/api/cycleApi';
import { useGetusersQuery } from '@/lib/redux/api/userApi';
import { Cycle } from '@/lib/redux/types/cycle';
import { CardComponent } from './CardComponent';
import { SkeletonCard } from './SkeletonCard';

const AdminStats = () => {
    const { data: cycleData } = useGetCycleQuery();
    const { data, isLoading, error } = useGetusersQuery({ page: 1, limit: 4 });

    if (isLoading) {
        return (
            <div className="flex justify-center py-3">
                <div className="flex flex-col items-start gap-4">
                    <h1 className="text-2xl font-bold">Admin Command Center</h1>
                    <div className="flex gap-8 flex-wrap justify-center">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </div>
        );
    }

    if (error) return <div>Error loading users</div>;

    const getTotalUsers = () => data?.data.total_count;

    const getTotalActiveCycles = () => {
        return cycleData?.data?.cycles?.filter((cycle: Cycle) => cycle.is_active).length || 0;
    };

    const getTotalApplicants = () => {
        return 42;
    };

    const stats = [
        { title: 'Total Users', num: getTotalUsers() },
        { title: 'Total Applicants', num: getTotalApplicants() },
        { title: 'Active Cycles', num: getTotalActiveCycles() },
    ];
    console.log(stats)

    return (
        <div className="flex justify-center py-3">
            <div className="flex flex-col items-start gap-4">
                <h1 className="text-2xl  font-bold">Admin Command Center</h1>

                <div className="flex gap-8 flex-wrap justify-center">
                    <CardComponent title="Total Users" description={125} gradient="purple" />
                    <CardComponent title="Total Applicants (G7)" description={1204} gradient="green" />
                    <CardComponent title="Active Cycles" description={1} gradient="orange" />
                </div>
            </div>
        </div>

    );
};

export default AdminStats;
