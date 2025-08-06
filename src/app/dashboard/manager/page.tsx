"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";

interface Application {
  id: string;
  applicant_name: string;
  status: string;
  assigned_reviewer_name: string | null;
  school?: string;
  degree?: string;
  leetcode_handle?: string;
  codeforces_handle?: string;
  essay_why_a2sv?: string;
  essay_about_you?: string;
  resume_url?: string;
  submitted_at?: string;
  updated_at?: string;
}

const REVIEWERS = [
  { id: "1", name: "Jane R." },
  { id: "2", name: "Mike R." },
  { id: "3", name: "Andr@abcde" },
  { id: "4", name: "Alarm Monata" },
];

export default function ManagerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "API request was not successful");
      }

      setApplications(data.data.applications || []);
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationDetails = async (id: string) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/manager/applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "API request was not successful");
      }

      return data.data;
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
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reviewer_id: reviewerId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "API request was not successful");
      }

      return data;
    } catch (err) {
      console.error("Assign error:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplications();
    }
  }, [status]);

  const handleViewDetails = async (application: Application) => {
    try {
      setSelectedApp(application);
      const details = await fetchApplicationDetails(application.id);
      setSelectedApp({ ...application, ...details });
      setShowDetailsModal(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load details";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleAssignReviewer = (
    application: Application,
    reviewerId: string
  ) => {
    setSelectedApp(application);
    assignReviewer(application.id, reviewerId)
      .then(() => {
        toast.success("Reviewer assigned successfully");
        fetchApplications();
      })
      .catch((err) => {
        toast.error(err.message || "Failed to assign reviewer");
      });
  };

  const filteredReviewers = REVIEWERS.filter((reviewer) =>
    reviewer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (loading) {
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
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500 font-medium">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.length.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications
                .filter((app) => app.status === "in_progress")
                .length.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Interview Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Accepted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md: grid-cols-2 gap-between mt-8">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              All Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Assigned Reviewer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.applicant_name}
                    </TableCell>
                    <TableCell>
                      {application.submitted_at
                        ? new Date(
                            application.submitted_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {application.assigned_reviewer_name || "Not Assigned"}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {application.status.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(application)}
                          >
                            View Detail
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Assign to Reviewer
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <div className="px-2 py-1">
                                  <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full p-1 text-sm border rounded"
                                    value={searchTerm}
                                    onChange={(e) =>
                                      setSearchTerm(e.target.value)
                                    }
                                  />
                                </div>
                                {filteredReviewers.map((reviewer) => (
                                  <DropdownMenuItem
                                    key={reviewer.id}
                                    onClick={() =>
                                      handleAssignReviewer(
                                        application,
                                        reviewer.id
                                      )
                                    }
                                  >
                                    {reviewer.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Jane R.</h4>
                <p className="text-sm text-gray-600">
                  3 Assigned / Avg. 2.5 days
                </p>
                <p className="text-sm text-gray-600">12 Reviews</p>
              </div>
              <div>
                <h4 className="font-medium">Mike R.</h4>
                <p className="text-sm text-gray-600">
                  5 Assigned / Avg. 3.1 days
                </p>
                <p className="text-sm text-gray-600">8 Reviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
              <div>
                <h4 className="font-medium">Assign to Reviewer</h4>
                <input
                  type="text"
                  placeholder="Search for a reviewer"
                  className="w-full p-2 mt-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">2</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                    Andr@abcde
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                    Alarm Monata
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showDetailsModal && selectedApp && (
        <Dialog open onOpenChange={() => setShowDetailsModal(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Applicant Information</h3>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p>{selectedApp.applicant_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">School</p>
                  <p>{selectedApp.school || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Degree</p>
                  <p>{selectedApp.degree || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Technical Profiles</h3>
                <div>
                  <p className="text-sm text-gray-500">LeetCode Handle</p>
                  <p>{selectedApp.leetcode_handle || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Codeforces Handle</p>
                  <p>{selectedApp.codeforces_handle || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Essays</h3>
              <div>
                <p className="text-sm text-gray-500">Why A2SV?</p>
                <p className="whitespace-pre-line">
                  {selectedApp.essay_why_a2sv || "No essay provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">About You</p>
                <p className="whitespace-pre-line">
                  {selectedApp.essay_about_you || "No essay provided"}
                </p>
              </div>
            </div>

            {selectedApp.resume_url && (
              <div className="mt-4">
                <Button asChild variant="outline">
                  <a
                    href={selectedApp.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                </Button>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowDetailsModal(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
