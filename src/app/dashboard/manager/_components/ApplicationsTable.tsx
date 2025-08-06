"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import ApplicationDetailsModal from "./ApplicationDetailsModal";
import ApplicantDetailsReview from "./Review";

interface Application {
  id: string;
  applicant_name: string;
  status: string;
  assigned_reviewer_name: string | null;
  submitted_at?: string;
}

interface Reviewer {
  id: string;
  name: string;
}

interface ApplicationsTableProps {
  applications: Application[];
  reviewers: Reviewer[];
  onAssignReviewer: (applicationId: string, reviewerId: string) => void;
}

interface ApplicantDetails {
  id: string;
  applicant_name: string;
  status: string;
  school: string;
  student_id: string;
  leetcode_handle: string;
  codeforces_handle: string;
  essay_why_a2sv: string;
  essay_about_you: string;
  resume_url: string;
  submitted_at: string;
  updated_at: string;
}

interface ReviewDetails {
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
}

interface ApplicationDetailsResponse {
  success: boolean;
  data: {
    id: string;
    applicant_details: ApplicantDetails;
    review_details: ReviewDetails;
  };
  message: string;
}

export default function ApplicationsTable({
  applications,
  reviewers,
  onAssignReviewer,
}: ApplicationsTableProps) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<
    ApplicationDetailsResponse["data"] | null
  >(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentView, setCurrentView] = useState<"details" | "review">(
    "details"
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredReviewers = reviewers.filter((reviewer) =>
    reviewer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMenu = (applicationId: string) => {
    if (openMenuId === applicationId) {
      setOpenMenuId(null);
      setShowAllOptions(false);
    } else {
      setOpenMenuId(applicationId);
      setShowAllOptions(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenuId(null);
      setShowAllOptions(false);
      setHoveredOption(null);
    }
  };

  const fetchApplicationDetails = async (
    id: string
  ): Promise<ApplicationDetailsResponse["data"]> => {
    try {
      const response = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/reviews/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApplicationDetailsResponse = await response.json();
      return data.data;
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  };

  const handleViewDetails = async (application: Application) => {
    try {
      const details = await fetchApplicationDetails(application.id);
      setSelectedApp(details);
      setCurrentView("details");
      setShowDetailsModal(true);
      setOpenMenuId(null);
    } catch (err) {
      toast.error("Failed to load application details");
    }
  };

  const handleViewReview = async (application: Application) => {
    try {
      const details = await fetchApplicationDetails(application.id);
      setSelectedApp(details);
      setCurrentView("review");
      setShowReviewModal(true);
      setOpenMenuId(null);
    } catch (err) {
      toast.error("Failed to load review details");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 bg-gray-100 rounded-t-lg">
            <TableHead className="font-semibold text-gray-700 rounded-tl-lg">
              APPLICANT
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              SUBMITTED
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              ASSIGNED REVIEWER
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              STATUS
            </TableHead>
            <TableHead className="text-right rounded-tr-lg">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id} className="border-b border-gray-100">
              <TableCell className="font-medium">
                {application.applicant_name}
              </TableCell>
              <TableCell className="text-gray-600">
                {application.submitted_at
                  ? new Date(application.submitted_at).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                {application.assigned_reviewer_name ? (
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                    {application.assigned_reviewer_name}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                    Not Assigned
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-sm capitalize ${
                    application.status === "new"
                      ? "bg-green-50 text-green-700"
                      : application.status === "in_progress"
                      ? "bg-yellow-50 text-yellow-700"
                      : application.status === "interview"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {application.status.replace("_", " ")}
                </span>
              </TableCell>
              <TableCell className="text-right relative">
                <Button
                  variant="ghost"
                  className="h-8 px-3 py-1 text-blue-600 text-sm flex items-center gap-1"
                  onClick={() => toggleMenu(application.id)}
                >
                  Actions <ChevronDown className="h-3 w-3" />
                </Button>

                {openMenuId === application.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                    style={{
                      height: showAllOptions ? "auto" : "132px",
                      overflow: "hidden",
                      transition: "height 0.2s ease",
                    }}
                  >
                    <div className="py-1">
                      <div
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(application);
                        }}
                      >
                        Review
                      </div>
                      <div
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewReview(application);
                        }}
                      >
                        View Details
                      </div>
                      <div className="border-t border-gray-200"></div>

                      <div
                        className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onMouseEnter={() => setHoveredOption("assign")}
                        onMouseLeave={() => setHoveredOption(null)}
                      >
                        Assign Reviewer
                        {hoveredOption === "assign" && (
                          <div className="absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                            <div className="px-2 py-1 relative">
                              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search reviewers..."
                                className="w-full pl-8 pr-2 py-1 text-sm border rounded"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {filteredReviewers.map((reviewer) => (
                                <div
                                  key={reviewer.id}
                                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAssignReviewer(
                                      application.id,
                                      reviewer.id
                                    );
                                    setSearchTerm("");
                                    setOpenMenuId(null);
                                  }}
                                >
                                  {reviewer.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {!showAllOptions && (
                        <div
                          className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 cursor-pointer flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllOptions(true);
                          }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showDetailsModal && selectedApp && (
        <ApplicationDetailsModal
          application={selectedApp}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showReviewModal && selectedApp && (
        <ApplicantDetailsReview
          applicant={selectedApp.applicant_details}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </>
  );
}
