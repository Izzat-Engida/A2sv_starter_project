"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetusersQuery } from "@/lib/redux/api/userApi";
import { User } from "@/lib/redux/types/users";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetusersQuery({
    page: currentPage,
    limit: 5,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  // useEffect(() => {
  //   refetch();
  // }, []);
  const redirectToSignIn = () => {
    toast.error("Session expired. Please sign in again.");
    router.push("/auth/signin-admin");
  };

  const getInitialsFromFullName = (fullName: string): string => {
    if (!fullName) return "?";
    const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
    if (nameParts.length === 0) return "?";
    const firstInitial = nameParts[0].charAt(0);
    const lastInitial =
      nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleDelete = async (userId: string) => {
    try {
      if (!session?.accessToken) {
        redirectToSignIn();
        return;
      }

      const res = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        redirectToSignIn();
        return;
      }

      if (res.status === 404) {
        toast.error("User not found");
        return;
      }

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      refetch();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        redirectToSignIn();
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete user"
        );
      }
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const totalUsers = data?.data?.total_count || 0;
  const totalPages = Math.ceil(totalUsers / 5);

  const filteredUsers = (data?.data?.users ?? []).filter((user: User) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={`ellipsis-${index}`} className="px-2">
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => setCurrentPage(page as number)}
          className={`px-3 mx-1 py-1 rounded text-gray-500 ${currentPage === page
            ? "bg-indigo-300 outline outline-indigo-600"
            : "outline outline-gray-500"
            }`}
        >
          {page}
        </button>
      )
    );
  };

  if (isError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-red-500">Error fetching users</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-4 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Administer and manage all users on the platform
          </p>
        </div>
        <Button
          className="bg-indigo-600 w-full sm:w-auto"
          onClick={() => {
            if (!session?.accessToken) {
              redirectToSignIn();
              return;
            }
            router.push("/dashboard/admin/users/create-user");
          }}
        >
          Create New User
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 my-3 border shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              className="w-full border pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-[#4F46E5] w-full sm:w-auto">
            All Roles
          </Button>
        </div>
      </div>

      {/* Table header (hidden on mobile) */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] p-3 text-gray-500">
        <p>Name</p>
        <p>Role</p>
        <p>Status</p>
        <p>Actions</p>
      </div>

      {/* User list */}
      <ul className="shadow-lg divide-y">
        {isLoading
          ? Array.from({ length: 5 }).map((_, idx) => (
            <li
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-2 p-3"
            >
              <div className="flex items-start md:items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="w-full max-w-[180px] space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </li>
          ))
          : filteredUsers.map((user: User) => (
            <li
              key={user.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-2 p-3"
            >
              {/* Avatar + Name + Role (flexed on mobile) */}
              <div className="flex items-start md:items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {getInitialsFromFullName(user.full_name)}
                  </AvatarFallback>
                </Avatar>

                <div className="overflow-hidden">
                  {/* Name + Role side-by-side on mobile */}
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold truncate max-w-[180px]">
                      {user.full_name}
                    </p>
                    <p className="text-gray-500 text-xs md:hidden">
                      {user.role}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 truncate max-w-[180px]">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Role (hidden on mobile) */}
              <p className="text-gray-500 text-sm md:text-base hidden md:block">
                {user.role}
              </p>

              {/* Status and Actions */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                {/* Status */}
                <p
                  className={`text-sm md:text-base inline-flex w-20 items-center px-2 py-1 rounded-full font-medium ${user.is_active
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </p>

                {/* Actions - positioned to the right on large screens */}
                <div className="flex gap-3 md:ml-auto">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    onClick={() => {
                      if (!session?.accessToken) {
                        redirectToSignIn();
                        return;
                      }
                      router.push(`/dashboard/admin/users/${user.id}`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition-colors"
                    onClick={() => openDeleteDialog(user)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
      </ul>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between m-4 gap-3 items-center">
        <p className="text-gray-500 text-sm sm:text-base">
          Showing {currentPage * 5 - 4} to {Math.min(currentPage * 5, totalUsers)} of{" "}
          {totalUsers}
        </p>
        <div className="flex shadow-lg">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-1 py-1 text-gray-500 outline outline-gray-300"
          >
            <ChevronLeft className="h-5" />
          </button>
          {renderPageNumbers()}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-1 py-1 text-gray-500 outline outline-gray-300"
          >
            <ChevronRight className="h-5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{userToDelete?.full_name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleDelete(userToDelete?.id || "")}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
