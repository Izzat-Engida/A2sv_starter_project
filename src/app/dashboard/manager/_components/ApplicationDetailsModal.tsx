"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

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

interface ApplicationDetails {
  id: string;
  applicant_details: ApplicantDetails;
  review_details: ReviewDetails;
}

interface ApplicationDetailsModalProps {
  application: ApplicationDetails;
  onClose: () => void;
}

export default function ApplicationDetailsModal({
  application,
  onClose,
}: ApplicationDetailsModalProps) {
  const app = application.applicant_details;
  const review = application.review_details;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
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
            <DialogTitle>Application: {app.applicant_name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">
                  Applicant Profile
                </h2>
                <div className="space-y-4">
                  <DetailSection title="Basic Information">
                    <DetailItem label="Full Name" value={app.applicant_name} />
                    <DetailItem label="Status" value={app.status} />
                    <DetailItem
                      label="Submitted At"
                      value={new Date(app.submitted_at).toLocaleDateString()}
                    />
                  </DetailSection>

                  <DetailSection title="Education">
                    <DetailItem label="School" value={app.school} />
                    <DetailItem label="Student ID" value={app.student_id} />
                  </DetailSection>

                  <DetailSection title="Coding Profiles">
                    <DetailItem
                      label="LeetCode Handle"
                      value={app.leetcode_handle}
                    />
                    <DetailItem
                      label="Codeforces Handle"
                      value={app.codeforces_handle}
                    />
                  </DetailSection>

                  <DetailSection title="Essay: Tell us about yourself">
                    <p className="text-gray-700 whitespace-pre-line">
                      {app.essay_about_you}
                    </p>
                  </DetailSection>

                  <DetailSection title="Essay: Why do you want to join A2SV?">
                    <p className="text-gray-700 whitespace-pre-line">
                      {app.essay_why_a2sv}
                    </p>
                  </DetailSection>

                  {app.resume_url && (
                    <DetailSection title="Resume">
                      <Button asChild variant="outline" className="gap-2">
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          Download Resume
                        </a>
                      </Button>
                    </DetailSection>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">Manager Actions</h2>
                <div className="space-y-4">
                  <DetailItem label="Application Status" value={app.status} />
                  <Button variant="default">Confirm</Button>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Final Decision
                    </label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Reject
                      </Button>
                      <Button className="flex-1">Accept</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Review Details</h2>
            <div className="space-y-4">
              <DetailSection title="Activity Check Notes">
                <p className="text-gray-700 whitespace-pre-line">
                  {review.activity_check_notes || "No notes provided"}
                </p>
              </DetailSection>

              <div className="grid grid-cols-2 gap-4">
                <ScoreItem
                  label="Resume Score"
                  value={review.resume_score}
                  max={100}
                />
                <ScoreItem
                  label="Why A2SV Essay Score"
                  value={review.essay_why_a2sv_score}
                  max={100}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ScoreItem
                  label="About You Essay Score"
                  value={review.essay_about_you_score}
                  max={100}
                />
                <ScoreItem
                  label="Technical Interview"
                  value={review.technical_interview_score}
                  max={100}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ScoreItem
                  label="Behavioral Interview"
                  value={review.behavioral_interview_score}
                  max={100}
                />
              </div>

              <DetailSection title="Interview Notes">
                <p className="text-gray-700 whitespace-pre-line">
                  {review.interview_notes || "No notes provided"}
                </p>
              </DetailSection>
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
    <div className="space-y-2">
      <h3 className="font-medium text-gray-700 border-b pb-2">{title}</h3>
      <div className="pl-4 space-y-3">{children}</div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <p className="text-sm text-gray-500 col-span-1">{label}</p>
      <p className="font-medium col-span-2">{value || "Not provided"}</p>
    </div>
  );
}

function ScoreItem({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <p className="text-sm text-gray-500 col-span-1">{label}</p>
      <p className="font-medium col-span-2">
        {value}/{max}
      </p>
    </div>
  );
}
