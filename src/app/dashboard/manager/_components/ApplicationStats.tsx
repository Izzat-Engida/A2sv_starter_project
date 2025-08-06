import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ApplicationStatsProps {
  applications: Application[];
}

export default function ApplicationStats({
  applications,
}: ApplicationStatsProps) {
  const stats = {
    total: applications.length,
    underReview: applications.filter((app) => app.status === "in_progress")
      .length,
    interviewStage: 250, // Would come from API in real implementation
    accepted: 82, // Would come from API in real implementation
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Total Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.total.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Under Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.underReview.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Interview Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.interviewStage.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Accepted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.accepted.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
