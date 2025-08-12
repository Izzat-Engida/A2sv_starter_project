"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ApplicationStats from "./_components/ApplicationStats";
import ApplicationsTable from "./_components/ApplicationsTable";
import PerformanceMetrics from "./_components/PerformanceMetrics";

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
}

interface Reviewer {
  id: string;
  full_name: string;
  email: string;
}

interface ApplicationsResponse {
  success: boolean;
  data: {
    applications: Application[];
    total_count: number;
    page: number;
    limit: number;
  };
  message: string;
}

interface ReviewersResponse {
  success: boolean;
  data: {
    reviewers: Reviewer[];
    total_count: number;
  };
  message: string;
}

interface ApplicationDetailsResponse {
  success: boolean;
  data: {
    application: {
      id: string;
      status: string;
      school: string;
      student_id: string;
      country: string;
      degree: string;
      leetcode_handle: string;
      codeforces_handle: string;
      essay_why_a2sv: string;
      essay_about_you: string;
      resume_url: string;
      submitted_at: string;
      updated_at: string;
      applicant_name: string;
    };
    review: {
      id: string;
      application_id: string;
      reviewer_id: string;
      activity_check_notes: string;
      resume_score: number;
      essay_why_a2sv_score: number;
      essay_about_you_score: number;
      technical_interview_score: number;
      behavioral_interview_score: number;
      interview_notes: string;
      created_at: string;
      updated_at: string;
    };
  };
  message: string;
}

export default function ManagerDashboard() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [reviewersPagination, setReviewersPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin-admin");
    }
  }, [authStatus, router]);

  const fetchApplications = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);

      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/manager/applications/?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApplicationsResponse = await response.json();
      console.log(data, "data")
      setApplications(data?.data.applications || []);
      setPagination({
        page: data?.data.page,
        limit: data?.data.limit,
        total: data?.data.total_count,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewers = async (page: number = 1, limit: number = 10) => {
    try {
      if (!session?.accessToken) return;

      const response = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/manager/applications/available-reviewers/?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ReviewersResponse = await response.json();
      setReviewers(data.data.reviewers || []);
      setReviewersPagination({
        page,
        limit,
        total: data.data.total_count,
      });
    } catch (err) {
      console.error("Failed to fetch reviewers:", err);
      toast.error("Failed to load reviewers");
    }
  };

  const fetchApplicationDetails = async (id: string) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/manager/applications/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response?.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApplicationDetailsResponse = await response.json();
      return {
        id: data?.data.application.id,
        applicant_details: {
          id: data?.data.application.id,
          applicant_name: data?.data.application.applicant_name,
          status: data?.data.application.status,
          school: data?.data.application.school,
          student_id: data?.data.application.student_id,
          leetcode_handle: data?.data.application.leetcode_handle,
          codeforces_handle: data?.data.application.codeforces_handle,
          essay_why_a2sv: data?.data.application.essay_why_a2sv,
          essay_about_you: data?.data.application.essay_about_you,
          resume_url: data?.data.application.resume_url,
          submitted_at: data?.data.application.submitted_at,
          updated_at: data?.data.application.updated_at,
        },
        review_details: data?.data.review && {
          id: data?.data.review.id,
          application_id: data?.data.review.application_id,
          reviewer_id: data?.data.review.reviewer_id,
          activity_check_notes: data?.data.review.activity_check_notes,
          resume_score: data?.data.review.resume_score,
          essay_why_a2sv_score: data?.data.review.essay_why_a2sv_score,
          essay_about_you_score: data?.data.review.essay_about_you_score,
          technical_interview_score:
            data?.data.review.technical_interview_score,
          behavioral_interview_score:
            data?.data.review.behavioral_interview_score,
          interview_notes: data?.data.review.interview_notes,
          created_at: data?.data.review.created_at,
          updated_at: data?.data.review.updated_at,
        },
      };
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  };

  const assignReviewer = async (applicationId: string, reviewerId: string) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/manager/applications/${applicationId}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ reviewer_id: reviewerId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      toast.success("Reviewer assigned successfully");
      fetchApplications(pagination.page, pagination.limit);
    } catch (err) {
      console.error("Assignment error:", err);
      toast.error("Failed to assign reviewer");
    }
  };

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchApplications();
      fetchReviewers();
    }
  }, [authStatus, session]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    router.push("/auth/signin-admin");
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8 sm:mb-10 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Manager Dashboard
        </h1>
        <p className="text-sm font-medium text-gray-700">G7 November Intake</p>
      </div>

      {/* Stats */}
      <ApplicationStats applications={applications} />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        {/* Applications Table */}
        <Card className="border-0 bg-white shadow-sm flex-1 overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-bold">
              All Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ApplicationsTable
                applications={applications}
                reviewers={reviewers}
                onAssignReviewer={assignReviewer}
                fetchApplicationDetails={fetchApplicationDetails}
                pagination={pagination}
                onPageChange={(page) =>
                  fetchApplications(page, pagination.limit)
                }
                onReviewersPageChange={(page) =>
                  fetchReviewers(page, reviewersPagination.limit)
                }
                reviewersPagination={reviewersPagination}
                onStatusChange={() =>
                  fetchApplications(pagination.page, pagination.limit)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="w-full lg:w-1/3">
          <PerformanceMetrics reviewers={reviewers} />
        </div>
      </div>
    </div>
  );
}
