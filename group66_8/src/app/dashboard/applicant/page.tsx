"use client";
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
import Check from "./icons/Check";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { useSession } from "next-auth/react";

const page = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const userName = session?.user?.name || "Applicant";
  const profileCompletion = useSelector(
    (state: RootState) => state.application.profileCompletion
  );
  const checklist = useSelector(
    (state: RootState) => state.application.checklist
  );
  const formSteps = useSelector(
    (state: RootState) => state.application.formSteps
  );
  return (
    <div className="max-w-[1280px] w-full mx-auto px-2 sm:px-4 md:px-8">
      <div>
        <Card className="bg-gray-100 border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Welcome, {userName}!
            </CardTitle>
            <CardDescription>
              Your journey to a global tech career starts now.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[611.5px] w-full">
        <Card className="pl-4 pr-4 text-white bg-[linear-gradient(to_right,_#6366F1,_#9333EA)] h-[212px] flex-shrink-0 flex-grow-0 lg:flex-[2] mb-4 lg:mb-0">
          <CardHeader className="p-2 text-white">
            <CardTitle className="text-xl font-bold">
              G7 November Intake
            </CardTitle>
            <CardDescription className="text-white">
              {" "}
              It's time to submit your application and show us your potential.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2 items-start">
            <Button
              type="submit"
              onClick={() => {
                router.push("/dashboard/applicant/apply");
              }}
              className="bg-white text-[#4F46E5] p-5 border-none outline-none hover:bg-[#ffffffe2] transition-colors"
            >
              Start Application
            </Button>
          </CardFooter>
        </Card>
        <div className="flex flex-col flex-1 gap-y-4 min-h-0">
          <Card className="flex-1 flex flex-col bg-white shadow-md">
            <CardHeader>
              <CardTitle className="pb-1 font-bold text-lg">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="flex flex-col gap-2 font-semibold text-[#4F46E5]">
                <p className="bg-[#C7D2FE] w-fit px-2 py-1.5 rounded-3xl">
                  {profileCompletion}% COMPLETE
                </p>
                <div>
                  <Progress
                    className="[&>div]:bg-[#6366F1] bg-[#C7D2FE]"
                    value={profileCompletion}
                  />
                </div>
                <CardFooter className="p-0">
                  <div className="flex items-center font-semibold ">
                    Go to profile
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </CardFooter>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex-[2] flex flex-col bg-white shadow-md">
            <CardHeader className="flex flex-col flex-1">
              <CardTitle className="pb-1 font-bold text-lg">
                Application Checklist
              </CardTitle>
              <CardDescription className="flex flex-1 flex-col justify-between">
                <div className="flex items-center">
                  <Check completed={formSteps.personal === "completed"} />
                  <p className="pl-2">Fill Personal information</p>
                </div>
                <div className="flex items-center">
                  <Check completed={formSteps.coding === "completed"} />
                  <p className="pl-2">Submit Coding Profiles</p>
                </div>
                <div className="flex items-center">
                  <Check completed={formSteps.essay === "completed"} />
                  <p className="pl-2">Write Essays</p>
                </div>
                <div className="flex items-center">
                  <Check completed={checklist.resume === "completed"} />
                  <p className="pl-2">Upload Resume</p>
                </div>
                <div className="flex items-center">
                  <Check completed={checklist.profile === "completed"} />
                  <p className="pl-2">Complete Profile</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex-1 flex flex-col bg-white shadow-md">
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                Helpful Resources
              </CardTitle>
              <CardFooter className="flex flex-col items-start p-0">
                <Button
                  variant="link"
                  className="text-[#4F46E5] p-0 hover:no-underline"
                >
                  Tips for a Great Application
                </Button>
                <Button
                  variant="link"
                  className="text-[#4F46E5] p-0 hover:no-underline"
                >
                  A2SV Problem Solving Guide
                </Button>
              </CardFooter>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;