"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  reviewer_name: string;
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

interface ApplicationDetails {
  id: string;
  applicant_details: ApplicantDetails;
  review_details: ReviewDetails;
  assigned_reviewer_name?: string | null;
}

interface ApplicationDetailsModalProps {
  application: ApplicationDetails;
  onClose: () => void;
  onStatusChange: () => void;
}

export default function ApplicationDetailsModal({
  application,
  onClose,
  onStatusChange,
}: ApplicationDetailsModalProps) {
  const { data: session } = useSession();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();

  if (!application) {
    return null;
  }

  const app = application.applicant_details;
  const review = application.review_details;

  const assignReviewer = async () => {
    try {
      setIsConfirming(true);

      if (!session?.accessToken) {
        await signIn();
        return;
      }

      if (!application?.id) {
        console.error("Missing application ID:", application);
        throw new Error("Application data is incomplete - missing ID");
      }

      if (!review?.reviewer_id) {
        throw new Error("Reviewer ID is missing");
      }

      console.log("Making assignment request with:", {
        applicationId: application.id,
        reviewerId: review.reviewer_id,
      });

      const response = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/manager/applications/${application.id}/assign/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            reviewer_id: review.reviewer_id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      toast.success("Reviewer assigned successfully");
      onStatusChange();
    } catch (err) {
      console.error("Assignment error:", err);

      toast.error("Failed to assign reviewer");
    } finally {
      setIsConfirming(false);
    }
  };

  const makeDecision = async (decision: "accepted" | "rejected") => {
    try {
      if (decision === "accepted") {
        setIsAccepting(true);
      } else {
        setIsRejecting(true);
      }

      if (!session?.accessToken) {
        await signIn();
        return;
      }

      if (!application?.id) {
        throw new Error("Application ID is missing");
      }

      const response = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/manager/applications/${application.id}/decide/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            status: decision,
            decision_notes: `Application ${decision}`,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      toast.success( `Application ${decision} successfully`);
      onStatusChange();
      onClose();
    } catch (err) {
      console.error("Decision error:", err);
      toast.error( `Failed to ${decision} application`);
      
    } finally {
      setIsAccepting(false);
      setIsRejecting(false);
    }
  };

  useEffect(() => {
    if (!session?.accessToken) {
      router.push("/auth/signin-admin");
    }
  }, [session, router]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90vw] xl:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle className="text-xl lg:text-2xl">
              Application: {app?.applicant_name || "Unknown"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Applicant Profile */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6 h-full">
                <h2 className="text-xl font-semibold mb-6">
                  Applicant Profile
                </h2>
                <div className="space-y-6">
                  <DetailSection title="Basic Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="Full Name" value={app?.applicant_name} />
                      <DetailItem
                        label="Status"
                        value={
                          app?.status === "pending_review"
                            ? `Assigned to ${review?.reviewer_name || "reviewer"}`
                            : app?.status
                        }
                      />
                      <DetailItem
                        label="Submitted At"
                        value={
                          app?.submitted_at
                            ? new Date(app.submitted_at).toLocaleDateString()
                            : "N/A"
                        }
                      />
                    </div>
                  </DetailSection>

                  <DetailSection title="Education">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="School" value={app?.school} />
                      <DetailItem label="Student ID" value={app?.student_id} />
                    </div>
                  </DetailSection>

                  <DetailSection title="Coding Profiles">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem
                        label="LeetCode Handle"
                        value={app?.leetcode_handle}
                      />
                      <DetailItem
                        label="Codeforces Handle"
                        value={app?.codeforces_handle}
                      />
                    </div>
                  </DetailSection>

                  <DetailSection title="Essay: Tell us about yourself">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">
                        {app?.essay_about_you || "Not provided"}
                      </p>
                    </div>
                  </DetailSection>

                  <DetailSection title="Essay: Why do you want to join A2SV?">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">
                        {app?.essay_why_a2sv || "Not provided"}
                      </p>
                    </div>
                  </DetailSection>

                  {app?.resume_url && (
                    <DetailSection title="Resume">
                      <Button asChild variant="outline" className="gap-2">
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Resume</span>
                        </a>
                      </Button>
                    </DetailSection>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Manager Actions and Review Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6 h-full">
                <h2 className="text-xl font-semibold mb-6">
                  Manager Actions
                </h2>
                <div className="space-y-6">
                  <DetailItem
                    label="Assigned Reviewer"
                    value={application.assigned_reviewer_name || "Not assigned"}
                  />

                  {app?.status === "pending_review" && (
                    <Button
                      variant="default"
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
                      onClick={assignReviewer}
                      disabled={isAccepting || isRejecting || isConfirming}
                    >
                      {isConfirming ? "Confirming..." : "Confirm"}
                    </Button>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Final Decision
                      </label>
                      <p className="text-gray-500 text-sm mt-1">
                        This action is final and will notify the applicant
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        className="flex-1 bg-[#4F46E5] cursor-pointer"
                        onClick={() => makeDecision("accepted")}
                        disabled={isAccepting || isRejecting || isConfirming}
                      >
                        {isAccepting ? "Accepting..." : "Accept"}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-black text-white cursor-pointer"
                        onClick={() => makeDecision("rejected")}
                        disabled={isAccepting || isRejecting || isConfirming}
                      >
                        {isRejecting ? "Rejecting..." : "Reject"}
                      </Button>

                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Review Details
                </h2>
                <div className="space-y-6">
                  <DetailSection title="Activity Check Notes">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">
                        {review?.activity_check_notes || "No notes provided"}
                      </p>
                    </div>
                  </DetailSection>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ScoreItem
                      label="Resume Score"
                      value={review?.resume_score}
                      max={100}
                    />
                    <ScoreItem
                      label="Why A2SV Essay Score"
                      value={review?.essay_why_a2sv_score}
                      max={100}
                    />
                    <ScoreItem
                      label="About You Essay Score"
                      value={review?.essay_about_you_score}
                      max={100}
                    />
                    <ScoreItem
                      label="Technical Interview"
                      value={review?.technical_interview_score}
                      max={100}
                    />
                    <ScoreItem
                      label="Behavioral Interview"
                      value={review?.behavioral_interview_score}
                      max={100}
                    />
                  </div>

                  <DetailSection title="Interview Notes">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">
                        {review?.interview_notes || "No notes provided"}
                      </p>
                    </div>
                  </DetailSection>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-700 border-b pb-2 text-base">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="block text-sm text-gray-500 font-medium mb-1">
        {label}
      </p>
      <p className="block text-base text-gray-700 pl-1 bg-gray-100 rounded p-2">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function ScoreItem({
  label,
  value,
  max,
}: {
  label: string;
  value?: number;
  max: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-base">
        {value !== undefined ? `${value}/${max}` : "Not scored"}
      </p>
    </div>
  );
}