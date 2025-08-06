"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Application } from "../page";

interface ApplicationDetailsModalProps {
  application: Application;
  onClose: () => void;
}

export default function ApplicationDetailsModal({
  application,
  onClose,
}: ApplicationDetailsModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Applicant Information</h3>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{application.applicant_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">School</p>
              <p>{application.school || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Degree</p>
              <p>{application.degree || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Technical Profiles</h3>
            <div>
              <p className="text-sm text-gray-500">LeetCode Handle</p>
              <p>{application.leetcode_handle || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Codeforces Handle</p>
              <p>{application.codeforces_handle || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="font-medium">Essays</h3>
          <div>
            <p className="text-sm text-gray-500">Why A2SV?</p>
            <p className="whitespace-pre-line">
              {application.essay_why_a2sv || "No essay provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">About You</p>
            <p className="whitespace-pre-line">
              {application.essay_about_you || "No essay provided"}
            </p>
          </div>
        </div>

        {application.resume_url && (
          <div className="mt-4">
            <Button asChild variant="outline">
              <a
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            </Button>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
