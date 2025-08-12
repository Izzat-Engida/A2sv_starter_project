"use client";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  completeChecklistItem,
  goToNextFormStep,
  setApplicationProgress,
  setFormStepStatus,
  updateProfileCompletion,
} from "@/lib/redux/slice/applicationSlice";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

const page = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  console.log(token);
  const dispatch = useDispatch();
  const router = useRouter();

  // console.log(token, "valid token");
  if (!token) {
    router.push("/auth/signin-user");
    console.log("token expire");
  }

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    idNumber: "",
    school: "",
    degree: "",
    country: "",
    codeforces: "",
    leetcode: "",
    github: "",
    about: "",
    whyJoin: "",
    resume: null as File | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const userName = "John";
  const percentComplete = 75;

  const handleSubmit = async () => {
    const isValid = validateStep(step);
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("student_id", formData.idNumber);
      data.append("school", formData.school);
      data.append("degree", formData.degree);
      data.append("country", formData.country);
      data.append("codeforces_handle", formData.codeforces);
      data.append("leetcode_handle", formData.leetcode);
      data.append("essay_about_you", formData.about);
      data.append("essay_why_a2sv", formData.whyJoin);

      if (formData.resume) {
        data.append("resume", formData.resume);
      }

      const res = await fetch(
        "https://a2sv-application-platform-backend-team8.onrender.com/applications/",
        {
          method: "POST",
          body: data,
          headers: {
            Authorization:
              session && session.accessToken
                ? `Bearer ${session.accessToken}`
                : "",
          },
        }
      );

      if (res.status === 409) {
        toast.error(
          "You have already submitted an application. Duplicate submissions are not allowed."
        );
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Submission failed");
      }

      const result = await res.json();

      dispatch(setFormStepStatus({ step: "essay", status: "completed" }));
      dispatch(completeChecklistItem("resume"));
      dispatch(setApplicationProgress({ submitted: "completed" }));
      dispatch(updateProfileCompletion(100));

      toast.success("Application submitted successfully!");
      console.log("✅ Form submitted successfully");

      router.push("/dashboard/applicant");

    } catch (err) {
      console.error("❌ Error submitting form:", err);
      toast.error(err instanceof Error ? err.message : "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function validateField(field: string, value: string | File | null) {
    let error = "";
    if (
      [
        "idNumber",
        "school",
        "degree",
        "codeforces",
        "leetcode",
        "github",
        "about",
        "whyJoin",
      ].includes(field)
    ) {
      if (!value || (typeof value === "string" && !value.trim())) {
        error = "Required";
      }
    }
    if (field === "resume") {
      if (!value) error = "Please upload a resume";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  }

  function validateStep(step: number) {
    const newErrors: { [key: string]: string } = {};
    if (step === 1) {
      if (!formData.idNumber.trim()) newErrors.idNumber = "Required";
      if (!formData.school.trim()) newErrors.school = "Required";
      if (!formData.degree.trim()) newErrors.degree = "Required";
    }
    if (step === 2) {
      if (!formData.codeforces.trim()) newErrors.codeforces = "Required";
      if (!formData.leetcode.trim()) newErrors.leetcode = "Required";
      if (!formData.github.trim()) newErrors.github = "Required";
    }
    if (step === 3) {
      if (!formData.about.trim()) newErrors.about = "Required";
      if (!formData.whyJoin.trim()) newErrors.whyJoin = "Required";
      if (!formData.resume) newErrors.resume = "Please upload a resume";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  const handleNext = () => {
    if (!validateStep(step + 1)) return;

    // Update Redux form step state and checklist/progress when moving forward
    if (step === 0) {
      // Completing Personal Info → move to Coding Profiles
      dispatch(setFormStepStatus({ step: "personal", status: "completed" }));
      dispatch(setFormStepStatus({ step: "coding", status: "inprogress" }));
      dispatch(completeChecklistItem("profile"));
      dispatch(updateProfileCompletion(33));
    } else if (step === 1) {
      // Completing Coding Profiles → move to Essays & Resume
      dispatch(setFormStepStatus({ step: "coding", status: "completed" }));
      dispatch(setFormStepStatus({ step: "essay", status: "inprogress" }));
      dispatch(completeChecklistItem("documents"));
      dispatch(updateProfileCompletion(66));
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <>
      <Toaster />
      {step === 0 && (
        <div className="flex items-center justify-center min-h-screen w-full px-2 sm:px-4 md:px-8">
          <div className="w-full max-w-[704px]">
            {/* Top Section with Title and Progress */}
            <Card className=" rounded-t-md rounded-b-none">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                  Application Form
                </CardTitle>
                <div className="px-6">
                  <Progress
                    className="[&>div]:bg-[#6366F1] bg-[#C7D2FE]"
                    value={33}
                  />
                </div>
                {/* Step Indicator */}
                <div className="flex justify-between text-sm font-medium text-gray-500 mt-4 px-6">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-xs">
                      1
                    </div>
                    <span className="mt-1 text-[#6366F1]">Personal Info</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
                      2
                    </div>
                    <span className="mt-1">Coding Profiles</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
                      3
                    </div>
                    <span className="mt-1">Essays & Resume</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
            {/* Form Section */}
            <Card className="rounded-b-md rounded-t-none p-4">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                <div className="flex flex-col">
                  <input
                    onChange={(e) => {
                      setFormData({ ...formData, idNumber: e.target.value });
                    }}
                    onBlur={(e) => validateField("idNumber", e.target.value)}
                    type="text"
                    placeholder="ID Number"
                    className={`border p-2 rounded ${errors.idNumber ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.idNumber && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.idNumber}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <input
                    onChange={(e) => {
                      setFormData({ ...formData, school: e.target.value });
                    }}
                    onBlur={(e) => validateField("school", e.target.value)}
                    type="text"
                    placeholder="School / University"
                    className={`border p-2 rounded ${errors.school ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.school && (
                    <p className="text-xs text-red-500 mt-1">{errors.school}</p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 col-span-full">
                  <div className="flex flex-col flex-1">
                    <input
                      onChange={(e) => {
                        setFormData({ ...formData, degree: e.target.value });
                      }}
                      onBlur={(e) => validateField("degree", e.target.value)}
                      type="text"
                      placeholder="Degree Program"
                      className={`border p-2 rounded ${errors.degree ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.degree && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.degree}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <input
                      onChange={(e) => {
                        setFormData({ ...formData, country: e.target.value });
                      }}
                      onBlur={(e) => validateField("country", e.target.value)}
                      type="text"
                      placeholder="Country"
                      className={`border p-2 rounded ${errors.country ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.country && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Navigation Buttons */}
              <div className="flex justify-between px-4 mt-6">
                <button
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-600 py-2 px-4 rounded hover:bg-gray-300"
                  disabled={step === 0}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 text-white py-2 px-4 rounded"
                >
                  Next: Coding Profiles
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex items-center justify-center min-h-screen w-full px-2 sm:px-4 md:px-8">
          <div className="w-full max-w-[704px]">
            {/* Top Section with Title and Progress */}
            <Card className=" rounded-t-md rounded-b-none">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                  Application Form
                </CardTitle>
                <div className="px-6">
                  <Progress
                    className="[&>div]:bg-[#6366F1] bg-[#C7D2FE]"
                    value={66}
                  />
                </div>
                {/* Step Indicator */}
                <div className="flex justify-between text-sm font-medium text-gray-500 mt-4 px-6">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
                      1
                    </div>
                    <span className="mt-1 ">Personal Info</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-xs">
                      2
                    </div>
                    <span className="mt-1 text-[#6366F1]">Coding Profiles</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
                      3
                    </div>
                    <span className="mt-1">Essays & Resume</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
            {/* Form Section */}
            <Card className="rounded-b-md rounded-t-none p-4">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Coding Profiles
                </CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                <div className="flex flex-col">
                  <input
                    onChange={(e) => {
                      setFormData({ ...formData, codeforces: e.target.value });
                    }}
                    onBlur={(e) => validateField("codeforces", e.target.value)}
                    type="text"
                    placeholder="Codeforces"
                    className={`border p-2 rounded ${errors.codeforces ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.codeforces && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.codeforces}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <input
                    onChange={(e) => {
                      setFormData({ ...formData, leetcode: e.target.value });
                    }}
                    onBlur={(e) => validateField("leetcode", e.target.value)}
                    type="text"
                    placeholder="LeetCode"
                    className={`border p-2 rounded ${errors.leetcode ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.leetcode && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.leetcode}
                    </p>
                  )}
                </div>
                <div className="flex flex-col col-span-full">
                  <input
                    onChange={(e) => {
                      setFormData({ ...formData, github: e.target.value });
                    }}
                    onBlur={(e) => validateField("github", e.target.value)}
                    type="text"
                    placeholder="Github"
                    className={`border p-2 rounded ${errors.github ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.github && (
                    <p className="text-xs text-red-500 mt-1">{errors.github}</p>
                  )}
                </div>
              </div>
              {/* Navigation Buttons */}
              <div className="flex justify-between px-4 mt-6">
                <button
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-600 py-2 px-4 rounded hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 text-white py-2 px-4 rounded"
                >
                  Next: Essay and Resumes
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="flex items-center justify-center min-h-screen w-full px-2 sm:px-4 md:px-8">
          <div className="w-full max-w-[704px]">
            {/* Top Section with Title and Progress */}
            <Card className=" rounded-t-md rounded-b-none">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                  Application Form
                </CardTitle>
                <div className="px-6">
                  <Progress
                    className="[&>div]:bg-[#6366F1] bg-[#C7D2FE]"
                    value={100}
                  />
                </div>
                {/* Step Indicator */}
                <div className="flex justify-between text-sm font-medium text-gray-500 mt-4 px-6">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
                      1
                    </div>
                    <span className="mt-1 ">Personal Info</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
                      2
                    </div>
                    <span className="mt-1">Coding Profiles</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-xs">
                      3
                    </div>
                    <span className="mt-1 text-[#6366F1]">Essays & Resume</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
            {/* Form Section */}
            <Card className="rounded-b-md rounded-t-none p-4">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Essays & Resume
                </CardTitle>
              </CardHeader>
              <div className="flex flex-col gap-6 px-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="about"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Tell us about yourself.
                  </label>
                  <textarea
                    onChange={(e) => {
                      setFormData({ ...formData, about: e.target.value });
                    }}
                    onBlur={(e) => validateField("about", e.target.value)}
                    id="about"
                    name="about"
                    rows={4}
                    className={`border rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.about ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Write something about yourself..."
                  />
                  {errors.about && (
                    <p className="text-xs text-red-500 mt-1">{errors.about}</p>
                  )}
                </div>

                {/* Why do you want to join us? */}
                <div className="flex flex-col">
                  <label
                    htmlFor="whyJoin"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Why do you want to Join us?
                  </label>
                  <textarea
                    onChange={(e) => {
                      setFormData({ ...formData, whyJoin: e.target.value });
                    }}
                    onBlur={(e) => validateField("whyJoin", e.target.value)}
                    id="whyJoin"
                    name="whyJoin"
                    rows={4}
                    className={`border rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.whyJoin ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Explain your motivation..."
                  />
                  {errors.whyJoin && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.whyJoin}
                    </p>
                  )}
                </div>

                {/* Resume upload */}
                <div className="flex flex-col">
                  <label
                    htmlFor="resume"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    Resume
                  </label>
                  <input
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        resume: e.target.files?.[0] || null,
                      });
                    }}
                    onBlur={(e) =>
                      validateField("resume", e.target.files?.[0] || null)
                    }
                    type="file"
                    accept=".pdf,.doc,.docx"
                    id="resume"
                    name="resume"
                    className={`file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 ${errors.resume ? "border-red-500" : ""
                      }`}
                  />
                  {errors.resume && (
                    <p className="text-xs text-red-500 mt-1">{errors.resume}</p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between px-4 mt-6">
                <button
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-600 py-2 px-4 rounded hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default page;
