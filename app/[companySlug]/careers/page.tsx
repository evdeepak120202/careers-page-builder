"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Company } from "@/types";
import { getCompanyBySlug } from "@/data/companies";
import { sampleJobs } from "@/data/jobs";
import { getJobsByCompanySlug } from "@/data/jobs-storage";
import { Job } from "@/types";
import { StructuredData } from "@/components/seo/structured-data";
import { CareersPageContent } from "@/components/careers/careers-page-content";

export default function CareersPage() {
  const params = useParams();
  const companySlug = params.companySlug as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 3;
    
    const loadCompany = () => {
      attempts++;
      const companyData = getCompanyBySlug(companySlug);
      if (companyData) {
        setCompany({ ...companyData });
        setNotFound(false);
        const companyJobs = getJobsByCompanySlug(companySlug);
        setJobs(companyJobs.length > 0 ? companyJobs : sampleJobs);
      } else {
        if (attempts >= maxAttempts) {
          setNotFound(true);
          setCompany(null);
        }
      }
    };
    
    loadCompany();
    const interval = setInterval(loadCompany, 2000);
    
    return () => clearInterval(interval);
  }, [companySlug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-2xl font-bold mb-2">Company Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The company "{companySlug}" doesn't exist or hasn't been set up yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Please contact the company administrator or check the URL.
          </p>
        </div>
      </div>
    );
  }

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
    <>
      <StructuredData company={company} jobs={jobs} />
      <CareersPageContent 
        key={`${company.id}-${company.updatedAt}`}
        company={company} 
        jobs={jobs} 
        showFilters={true} 
      />
    </>
  );
}

