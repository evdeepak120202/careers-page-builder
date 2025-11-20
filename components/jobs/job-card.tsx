import { Job } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Clock } from "lucide-react";

interface JobCardProps {
  job: Job;
  primaryColor?: string;
}

export function JobCard({ job, primaryColor = "#3b82f6" }: JobCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{job.title}</CardTitle>
        <CardDescription className="flex items-center gap-4 flex-wrap mt-2">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            {job.work_policy}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {job.posted_days_ago}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-muted">{job.department}</span>
            <span className="px-2 py-1 text-xs rounded-full bg-muted">{job.employment_type}</span>
            <span className="px-2 py-1 text-xs rounded-full bg-muted">{job.experience_level}</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">{job.salary_range}</p>
        </div>
        <Button
          className="w-full transition-colors"
          style={{ backgroundColor: primaryColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onClick={() => {
            alert(`Apply for ${job.title}`);
          }}
          aria-label={`View details for ${job.title} position`}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

