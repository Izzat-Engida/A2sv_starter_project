"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PerformanceMetrics() {
  return (
    <Card className="border-0 bg-white shadow-sm h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Team Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Jane R.</h4>
            <p className="text-sm text-gray-600">12 Reviews</p>
          </div>
          <p className="text-sm text-gray-600">3 Assigned / Avg. 2.5 days</p>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Mike R.</h4>
            <p className="text-sm text-gray-600">8 Reviews</p>
          </div>
          <p className="text-sm text-gray-600">5 Assigned / Avg. 3.1 days</p>
        </div>
      </CardContent>
    </Card>
  );
}
