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

interface ApplicantDetailsReviewProps {
  applicant: ApplicantDetails;
  onClose: () => void;
}

export default function ApplicantDetailsReview({
  applicant,
  onClose,
}: ApplicantDetailsReviewProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
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
            <DialogTitle>
              Applicant Review: {applicant.applicant_name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Applicant Details</h2>

          <div className="space-y-6">
            <DetailSection title="Basic Information">
              <DetailItem label="Full Name" value={applicant.applicant_name} />
              <DetailItem label="Status" value={applicant.status} />
              <DetailItem
                label="Submitted At"
                value={new Date(applicant.submitted_at).toLocaleDateString()}
              />
            </DetailSection>

            <DetailSection title="Education">
              <DetailItem label="School" value={applicant.school} />
              <DetailItem label="Student ID" value={applicant.student_id} />
            </DetailSection>

            <DetailSection title="Coding Profiles">
              <DetailItem
                label="LeetCode Handle"
                value={applicant.leetcode_handle}
              />
              <DetailItem
                label="Codeforces Handle"
                value={applicant.codeforces_handle}
              />
            </DetailSection>

            <DetailSection title="Essay: Tell us about yourself">
              <p className="text-gray-700 whitespace-pre-line">
                {applicant.essay_about_you}
              </p>
            </DetailSection>

            <DetailSection title="Essay: Why do you want to join A2SV?">
              <p className="text-gray-700 whitespace-pre-line">
                {applicant.essay_why_a2sv}
              </p>
            </DetailSection>

            {applicant.resume_url && (
              <DetailSection title="Resume">
                <Button asChild variant="outline" className="gap-2">
                  <a
                    href={applicant.resume_url}
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
