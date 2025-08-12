"use server";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CgSpinner } from "react-icons/cg";
import { FaCheckCircle, FaCalendarAlt, FaRegCircle } from "react-icons/fa";
import { getServerSession } from "next-auth";
import { Options } from "@/app/api/auth/[...nextauth]/options";
import Link from "next/link";

async function getApplicationStatus(token: string) {
  const response = await fetch(
    "https://a2sv-application-platform-backend-team8.onrender.com/applications/my-status/",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok || data.message === "No application found") {
    return {
      success: false,
      data: null,
      message: data.message || "No application submitted yet",
    };
  }

  console.log(data, "data fetched successfully");

  return {
    success: data.success,
    data: data.data, // actual application data object
    message: data.message || "Application status retrieved successfully",
  };
}

function getStages(apiData: any) {
  if (!apiData) return [];

  const status = apiData.status?.toLowerCase();

  return [
    {
      id: "submitted",
      title: "Application Submitted",
      description:
        "Your application has been successfully submitted. We're excited to learn more about you!",
      date: apiData.submitted_at
        ? format(new Date(apiData.submitted_at), "MMMM d, yyyy")
        : "",
      completed: status !== "not_submitted",
      icon: <FaCheckCircle className="w-7 h-7" />,
    },
    {
      id: "review",
      title: "Under Review",
      description:
        "Our team is currently reviewing your application. This may take a few days. Thank you for your patience.",
      date:
        status === "under_review" || status === "pending_review"
          ? "Current Stage"
          : "",
      active: status === "under_review" || status === "pending_review",
      icon:
        status === "under_review" || status === "pending_review" ? (
          <CgSpinner className="animate-spin w-5 h-5" />
        ) : (
          <CgSpinner className="w-5 h-5 opacity-30" />
        ),
    },
    {
      id: "interview",
      title: "Interview Stage",
      description: "",
      date: apiData.interview_date
        ? format(new Date(apiData.interview_date), "MMMM d, yyyy")
        : "",
      upcoming: ["interview_scheduled", "interview_passed"].includes(status),
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
    {
      id: "decision",
      title: "Decision Made",
      description: "",
      date: "",
      upcoming: status === "accepted",
      icon: <FaRegCircle className="w-5 h-5" />,
    },
  ];
}

export default async function ApplicationStatusPage() {
  const session = await getServerSession(Options);

  if (!session?.accessToken) {
    throw new Error(
      "Authentication required - Please sign in to view your application status"
    );
  }

  const result = await getApplicationStatus(session.accessToken);

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">No Application Found</h2>
          <p className="mb-4">You haven&#39;t submitted an application yet.</p>
          <Button asChild className="bg-[#4F46E5] hover:bg-[#352dd8]">
            <Link href="/dashboard/applicant/apply">Start New Application</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const statusStages = getStages(result.data);
  const submittedDate = result.data.submitted_at
    ? format(new Date(result.data.submitted_at), "MMMM d, yyyy")
    : "";
  const interviewDate = result.data.interview_date
    ? format(new Date(result.data.interview_date), "MMMM d, yyyy")
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Your Application Progress</h1>
        <p className="text-gray-600">
          You&#39;re on your way! Here&#39;s a summary of your application
          status.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Application Timeline</h2>
            <div className="space-y-8">
              {statusStages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="flex gap-4"
                  aria-disabled={stage.upcoming}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${stage.completed ? "text-green-500" : ""}
                      ${stage.active ? "text-blue-500" : ""}
                      ${stage.upcoming ? "text-gray-300" : ""}`}
                    >
                      {stage.icon}
                    </div>
                    {index < statusStages.length - 1 && (
                      <div
                        className={`w-1 h-16 ${stage.completed
                          ? "bg-green-200"
                          : stage.active
                            ? "bg-blue-200"
                            : "bg-gray-200"
                          }`}
                      />
                    )}
                  </div>
                  <div
                    className={`flex-1 ${stage.upcoming ? "opacity-50" : ""}`}
                  >
                    <div className="flex flex-col">
                      <h3
                        className={`text-lg font-medium ${stage.completed
                          ? "text-gray-800"
                          : stage.active
                            ? "text-[#4F46E5]"
                            : "text-gray-500"
                          }`}
                      >
                        {stage.title}
                      </h3>
                      {stage.date && (
                        <span
                          className={`text-sm ${stage.active ? "text-blue-500" : "text-gray-500"
                            } mb-2`}
                        >
                          {stage.date}
                        </span>
                      )}
                    </div>
                    {stage.description && (
                      <p className="text-gray-600">{stage.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:w-1/3 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-gray-300 w-7 h-7 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Application Submitted</h3>
                  <p className="text-sm text-gray-500">{submittedDate}</p>
                </div>
              </div>
              {interviewDate && (
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-blue-500 w-7 h-7 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Interview Scheduled</h3>
                    <p className="text-sm text-gray-500">{interviewDate}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Important Updates
            </h2>
            <p className="text-gray-600">
              There are no new updates at this time. We will notify you by email
              when your application status changes.
            </p>
          </Card>

          <Card className="p-6 bg-[#4F46E5] border-blue-100">
            <h2 className="text-xl text-white font-bold mb-4">
              Get Ready for the Interview!
            </h2>
            <p className="text-white mb-6">
              While you wait, it&#39;s a great time to prepare. Practice your
              problem-solving skills on platforms like LeetCode and Codeforces.
            </p>
            <div className="inline-flex items-center group">
              <a href="#" className="text-white font-medium">
                Read our interview prep guide
              </a>
              <span className="ml-2 text-white group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
