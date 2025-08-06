"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
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
  name: string;
}

export default function ManagerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        "https://a2sv-application-platform-backend-team8.onrender.com/manager/applications/",
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApplications(data.data.applications || []);
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

  const fetchReviewers = async () => {
    try {
      const response = await fetch(
        "https://a2sv-application-platform-backend-team8.onrender.com/manager/reviewers/",
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReviewers(data.data.reviewers || []);
    } catch (err) {
      console.error("Failed to fetch reviewers:", err);
    }
  };

  const assignReviewer = async (applicationId: string, reviewerId: string) => {
    try {
      const response = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/manager/applications/${applicationId}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({ reviewer_id: reviewerId }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      toast.success("Reviewer assigned successfully");
      fetchApplications(); // Refresh the list
    } catch (err) {
      toast.error("Failed to assign reviewer");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplications();
      fetchReviewers();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Failed to load applications
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              <button
                onClick={fetchApplications}
                className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="items-center mb-10 pl-20">
        <h1 className="text-2xl font-bold text-gray-900 pb-2">
          Manager Dashboard
        </h1>
        <p className="text-sm font-medium text-gray-700">G7 November Intake</p>
      </div>

      <ApplicationStats applications={applications} />

      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <Card className="border-0 bg-white shadow-sm md:w-3/4">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              All Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsTable
              applications={applications}
              reviewers={reviewers}
              onAssignReviewer={assignReviewer}
            />
          </CardContent>
        </Card>

        <div className="md:w-1/4">
          <PerformanceMetrics />
        </div>
      </div>
    </div>
  );
}
