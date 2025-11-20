"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Company } from "@/types";
import { getCompanyBySlug } from "@/data/companies";
import { sampleJobs } from "@/data/jobs";
import { getJobsByCompanySlug } from "@/data/jobs-storage";
import { Job } from "@/types";
import { CareersPageContent } from "@/components/careers/careers-page-content";

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const companySlug = params.companySlug as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const loadCompany = () => {
      try {
        const unsavedData = sessionStorage.getItem(`company_unsaved_${companySlug}`);
        const unsavedJobs = sessionStorage.getItem(`jobs_unsaved_${companySlug}`);
        
        if (unsavedData) {
          const parsed = JSON.parse(unsavedData) as Company;
          setCompany({ ...parsed });
          setHasUnsavedChanges(true);
          
          if (unsavedJobs) {
            try {
              const parsedJobs = JSON.parse(unsavedJobs) as Job[];
              setJobs(parsedJobs);
            } catch (error) {
              console.error("Error parsing unsaved jobs:", error);
            }
          }
          return;
        }
      } catch (error) {
        console.error("Error loading unsaved changes:", error);
      }

      const companyData = getCompanyBySlug(companySlug);
      if (companyData) {
        setCompany({ ...companyData });
        setHasUnsavedChanges(false);
        const companyJobs = getJobsByCompanySlug(companySlug);
        setJobs(companyJobs.length > 0 ? companyJobs : sampleJobs);
      }
    };
    
    loadCompany();
    const interval = setInterval(loadCompany, 500);
    
    return () => clearInterval(interval);
  }, [companySlug]);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground mb-2">Loading company data...</p>
          <p className="text-sm text-muted-foreground">
            {companySlug ? `Looking for: ${companySlug}` : "No company specified"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
            <h2 className="text-sm font-semibold text-muted-foreground">Preview Mode</h2>
            {hasUnsavedChanges && (
              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800">
                Showing Unsaved Changes
              </span>
            )}
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
        </div>
      </div>

      <CareersPageContent 
        key={`${company.id}-${company.updatedAt}`}
        company={company} 
        jobs={jobs} 
        showFilters={false} 
      />
    </div>
  );
}

