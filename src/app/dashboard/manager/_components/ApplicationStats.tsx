"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Application {
  id: string;
  applicant_name: string;
  status: string;
  assigned_reviewer_name: string | null;
  submitted_at?: string;
  school?: string;
  degree?: string;
  leetcode_handle?: string;
  codeforces_handle?: string;
  essay_why_a2sv?: string;
  essay_about_you?: string;
  resume_url?: string;
  reviewer_feedback?: {
    activity_guide?: string;
    passage_score?: number;
    track_interview?: number;
    interview_notes?: string;
    essay_score?: number;
    reviewer_score?: number;
  };
}

interface ApplicationStatsProps {
  applications: Application[];
  isLoading?: boolean;
}

export default function ApplicationStats({
  applications,
  isLoading = false,
}: ApplicationStatsProps) {
  // Calculate all stats from the applications data
  const stats = {
    total: applications.length,
    underReview: applications.filter((app) => app.status === "in_progress")
      .length,
    interviewStage: applications.filter((app) => app.status === "interview")
      .length,
    accepted: applications.filter((app) => app.status === "accepted").length,
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 bg-white shadow-sm">
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Total Applications" value={stats.total} />
      <StatCard title="Under Review" value={stats.underReview} />
      <StatCard title="Interview Stage" value={stats.interviewStage} />
      <StatCard title="Accepted" value={stats.accepted} />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  description?: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-sm text-gray-500 font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
