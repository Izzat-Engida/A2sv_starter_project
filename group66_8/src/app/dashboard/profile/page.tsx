"use client";
import React, { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import ReviewerNav from "@/components/ReviewerNav";
import ManagerNav from "@/components/ManagerNav";
import ApplicantNav from "@/components/ApplicantNav";
// Helper to get dashboard route by role
const getDashboardRoute = (role: string) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "/dashboard/admin";
    case "reviewer":
      return "/dashboard/reviewer";
    case "manager":
      return "/dashboard/manager";
    case "applicant":
      return "/dashboard/applicant/in-progress";
    default:
      return "/dashboard/profile";
  }
};
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import background from "../../../../public/background.svg";
import profile from "../../../../public/profile.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type User = {
  success: boolean;
  data: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    profile_picture_url: string;
  };
  message: string;
};

type PasswordForm = {
  current: string;
  new: string;
  confirm: string;
};

type ProfileForm = {
  full_name: string;
  email: string;
};

function UserProfile() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [data, setData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [profileFormError, setProfileFormError] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordForm>();
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileForm>();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = '/auth/sign_in_admin'
    }

    const fetchProfile = async () => {
      setIsFetchingProfile(true);
      if (status !== "authenticated" || !session?.accessToken) {
        setError("You must be logged in to view your profile.");
        setIsFetchingProfile(false);
        return;
      }

      try {
        const link = "https://a2sv-application-platform-backend-team8.onrender.com/profile/me";
        const res = await fetch(link, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const profileData: User = await res.json();
        setData(profileData);
        resetProfile({
          full_name: profileData.data.full_name,
          email: profileData.data.email,
        });
      } catch (e: any) {
        setError("An error occurred while fetching your profile");
        console.error(e, "Fetch error:");
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchProfile();
  }, [status, session?.accessToken, resetProfile, router]);

  const onPasswordSubmit = async (formData: PasswordForm) => {
    setFormError(null);
    if (formData.new !== formData.confirm) {
      setFormError("New password and confirm password do not match");
      return;
    }

    try {
      const res = await fetch(
        "https://a2sv-application-platform-backend-team8.onrender.com/profile/me/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            old_password: formData.current,
            new_password: formData.new,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      resetPassword();


      toast.success("Password changed successfully!")
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An error occurred while changing your password");
      }
    }

  };

  const onProfileSubmit = async (formData: ProfileForm) => {
    setProfileFormError(null);
    setIsProfileLoading(true);

    try {
      const res = await fetch(
        "https://a2sv-application-platform-backend-team8.onrender.com/profile/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile: User = await res.json();
      setData(updatedProfile);
      toast.success("Profile updated successfully!!")

    } catch (e) {
      setProfileFormError("An error occurred while updating your profile");
      console.error("Profile update error:", e);
    } finally {
      setIsProfileLoading(false);
    }
  };

  if (status === "loading" || isFetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
      </div>
    );
  }

  if (status !== "authenticated" || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error || "Please log in to view your profile."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-4 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative w-full h-48 sm:h-64 md:h-80">
          <Image
            src={background}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-4 sm:left-6 transform translate-y-1/2 flex items-end space-x-4">
            <Image
              src={data?.data?.profile_picture_url || profile}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full border-4 border-white sm:w-32 sm:h-32"
            />
            <div className="pb-2">
              <h1 className="text-xl sm:text-2xl font-bold">{data?.data?.full_name || "Unknown"}</h1>
              <p className="text-sm sm:text-base text-gray-600">{data?.data?.email || "No email"}</p>
            </div>
          </div>
        </div>

        <div className="pt-20 sm:pt-24 px-4 sm:px-6 pb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Personal Information</h2>
          {data?.success && data.data ? (
            <div className="space-y-4 text-base sm:text-lg">
              {/* Dashboard Button */}
              <div className="mb-4">
                <Button
                  type="button"
                  className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                  onClick={() => router.push(getDashboardRoute(data?.data?.role))}
                >
                  Go to Dashboard
                </Button>
              </div>
              {/* ...existing code... */}
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                {profileFormError && (
                  <div className="text-red-500 text-sm mb-2">{profileFormError}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-gray-700">Full Name</strong>
                    <Input
                      type="text"
                      {...registerProfile("full_name", { required: "Full name is required" })}
                      className="mt-1"
                    />
                    {profileErrors.full_name && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.full_name.message}</p>
                    )}
                  </div>
                  <div>
                    <strong className="text-gray-700">Email</strong>
                    <Input
                      type="email"
                      {...registerProfile("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email address",
                        },
                      })}
                      className="mt-1"
                    />
                    {profileErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <strong className="text-gray-700">Role</strong>
                    <p>{data.data.role}</p>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isProfileLoading}
                  className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                >
                  {isProfileLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>

              <div className="mt-6 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <Input
                      type="password"
                      {...registerPassword("current", { required: "Current password is required" })}
                      className="mt-1"
                    />
                    {passwordErrors.current && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.current.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <Input
                      type="password"
                      {...registerPassword("new", {
                        required: "New password is required",
                        //minLength: { value: 8, message: "Password must be at least 8 characters" },
                      })}
                      className="mt-1"
                    />
                    {passwordErrors.new && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.new.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <Input
                      type="password"
                      {...registerPassword("confirm", { required: "Please confirm your new password" })}
                      className="mt-1"
                    />
                    {passwordErrors.confirm && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.confirm.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                  >
                    Change Password
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div>No profile data available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
