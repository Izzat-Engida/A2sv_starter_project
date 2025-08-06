"use client";

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
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Application } from "../page";

interface ApplicationsTableProps {
  applications: Application[];
  onViewDetails: (application: Application) => void;
  onAssignReviewer: (application: Application) => void;
}

const REVIEWERS = [
  { id: "1", name: "Jane R." },
  { id: "2", name: "Mike R." },
  { id: "3", name: "Andr@abcde" },
  { id: "4", name: "Alarm Monata" },
];

export default function ApplicationsTable({
  applications,
  onViewDetails,
  onAssignReviewer,
}: ApplicationsTableProps) {
  return (
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
                ? new Date(application.submitted_at).toLocaleDateString()
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
                  <DropdownMenuItem onClick={() => onViewDetails(application)}>
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
                          />
                        </div>
                        {REVIEWERS.map((reviewer) => (
                          <DropdownMenuItem
                            key={reviewer.id}
                            onClick={() => onAssignReviewer(application)}
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
  );
}
