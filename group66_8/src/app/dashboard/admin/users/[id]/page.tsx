// app/users/[id]/edit/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Define valid roles according to your backend
const VALID_ROLES = ["applicant", "manager", "admin", "reviewer"];

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { data: session, status: authStatus } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    isActive: true,
  });

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      if (authStatus === "unauthenticated") {
        toast.error("Please sign in to continue");
        router.push("/auth/signin-admin");
        return;
      }

      if (!session?.accessToken) {
        toast.error("Session expired. Please sign in again.");
        return;
      }

      const res = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/admin/users/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 401) {
        toast.error("Session expired. Please sign in again.");
        router.push("/auth/signin-admin");
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const response = await res.json();
      if (response.success) {
        setFormData({
          fullName: response.data.full_name || "",
          email: response.data.email || "",
          password: "",
          role: VALID_ROLES.includes(response.data.role)
            ? response.data.role
            : "Reviewer",
          isActive: response.data.is_active || true,
        });
      } else {
        throw new Error(response.message || "Failed to load user data");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load user data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    if (authStatus === "authenticated") {
      fetchUser();
    }
  }, [userId, authStatus, session?.accessToken, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    if (VALID_ROLES.includes(value)) {
      setFormData((prev) => ({ ...prev, role: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!session?.accessToken) {
        toast.error("Session expired. Please sign in again.");
        router.push("/auth/signin-admin");
        return;
      }

      // Validate role before submitting
      if (!VALID_ROLES.includes(formData.role)) {
        throw new Error("Invalid role selected");
      }

      const res = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/admin/users/${userId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.fullName,
            email: formData.email,
            password: formData.password || undefined, // Send undefined if empty
            role: formData.role,
            is_active: formData.isActive,
          }),
        }
      );
      console.log(res, "result");
      if (res.status === 401) {
        toast.error("Session expired. Please sign in again.");
        router.push("/auth/signin-admin");
        return;
      }

      const response = await res.json();

      if (!res.ok) {
        throw new Error(
          response.message || `Failed to update user (status: ${res.status})`
        );
      }

      if (response.success) {
        toast.success(response.message || "User updated successfully");
        router.push("/dashboard/admin/users");
      } else {
        throw new Error(response.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      if (!session?.accessToken) {
        toast.error("Session expired. Please sign in again.");
        router.push("/auth/signin-admin");
        return;
      }

      const res = await fetch(
        `https://a2sv-application-platform-backend-team8.onrender.com/admin/users/${userId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 401) {
        toast.error("Session expired. Please sign in again.");
        router.push("/auth/signin-admin");
        return;
      }

      const response = await res.json();

      if (!res.ok) {
        throw new Error(
          response.message || `Failed to delete user (status: ${res.status})`
        );
      }

      if (response.success) {
        toast.success(response.message || "User deleted successfully");
        router.push("dashboard/admin/users");
      } else {
        throw new Error(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || authStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Card className="border-0 shadow-none bg-gray-50">
          <CardHeader className="px-0 pb-4 sm:pb-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
              Edit User: {formData.fullName || "—"}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Update the user's information and role.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Full name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="h-10 sm:h-11"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  className="h-10 sm:h-11 bg-gray-100"
                  placeholder="Email address"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-10 sm:h-11"
                  placeholder="Set a new password (optional)"
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="role"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Role
                </Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="h-10 sm:h-11">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-2 sm:mt-4 pt-4 sm:pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 h-10 bg-[#4F46E5] hover:bg-[#352dd8] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Update User"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 h-10 bg-black text-white"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete User"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
