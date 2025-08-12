"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Application {
  application_id: string;
  applicant_name: string;
  status: string;
  submission_date: string;
  school: string;
}

export default function ReviewerDashboard() {
  const { data: session } = useSession();
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "pending-review" | "accepted">(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const itemsPerPage = 3;

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/reviews/assigned/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await res.json();
      if (data.success) {
        setAllApplications(data.data.reviews || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all applications once
  useEffect(() => {
    if (session?.accessToken) {
      fetchApplications();
    }
  }, [session?.accessToken]);

  // Apply filtering, sorting, and pagination client-side
  useEffect(() => {
    let filtered = [...allApplications];

    if (filter !== "all") {
      if (filter === "pending-review") {
        filtered = filtered.filter((app) =>
          app.status.toLowerCase().includes("pending")
        );
      } else {
        filtered = filtered.filter(
          (app) => app.status.toLowerCase() === filter
        );
      }
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.submission_date).getTime();
      const dateB = new Date(b.submission_date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setTotalCount(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));

    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

    setApplications(paginated);
  }, [allApplications, filter, sortOrder, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;

    pages.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        className="cursor-pointer"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        1
      </Button>
    );

    if (currentPage > maxVisiblePages + 1) {
      pages.push(
        <span key="ellipsis-start" className="flex items-center px-2">
          ...
        </span>
      );
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          className="cursor-pointer"
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    if (currentPage < totalPages - maxVisiblePages) {
      pages.push(
        <span key="ellipsis-end" className="flex items-center px-2">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          className="cursor-pointer"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4F46E5]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6 sm:py-8 flex-1">
        <div className="justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Assigned Applications</h1>
          <p className="text-muted-foreground mt-2">
            Showing {applications.length} of {totalCount} applications
          </p>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant={filter === "all" ? "default" : "secondary"}
                className={
                  filter === "all"
                    ? "bg-[#4F46E5]  text-white cursor-pointer"
                    : "cursor-pointer"
                }
                size="sm"
                onClick={() => {
                  setFilter("all");
                  setCurrentPage(1);
                }}
              >
                All
              </Button>
              <Button
                variant={filter === "pending-review" ? "default" : "secondary"}
                className={
                  filter === "pending-review"
                    ? "bg-[#4F46E5]  text-white cursor-pointer"
                    : "cursor-pointer"
                }
                size="sm"
                onClick={() => {
                  setFilter("pending-review");
                  setCurrentPage(1);
                }}
              >
                Under Review
              </Button>
              <Button
                variant={filter === "accepted" ? "default" : "secondary"}
                className={
                  filter === "accepted"
                    ? "bg-[#4F46E5]  text-white cursor-pointer"
                    : "cursor-pointer"
                }
                size="sm"
                onClick={() => {
                  setFilter("accepted");
                  setCurrentPage(1);
                }}
              >
                completed
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
                  setCurrentPage(1);
                }}
              >
                Sort by Submission Date {sortOrder === "newest" ? "↓" : "↑"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {applications.map((app) => (
            <Card
              key={app.application_id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <Avatar>{app.applicant_name.charAt(0)}</Avatar>
                  <div>
                    <h3 className="font-medium">{app.applicant_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted:{" "}
                      {new Date(app.submission_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge
                    variant={
                      app.status.toLowerCase() === "accepted"
                        ? "secondary"
                        : app.status.toLowerCase().includes("update") ||
                          app.status.toLowerCase().includes("pending")
                          ? "outline"
                          : "default"
                    }
                  >
                    {app.status}
                  </Badge>
                </div>
                <Card className="border-0 shadow-none bg-gray-50 mt-4">
                  <div>
                    <Link href={`/dashboard/reviewer/${app.application_id}`}>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="bg-blue-500 text-white hover:bg-[#4F46E5] w-full hover:cursor-pointer"
                      >
                        {app.status.toLowerCase() === "accepted"
                          ? "View"
                          : app.status.toLowerCase().includes("update")
                            ? "Update"
                            : "Review"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </Button>

            {renderPageNumbers()}

            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
