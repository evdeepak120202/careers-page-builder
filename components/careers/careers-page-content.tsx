"use client";

import { Company, Job } from "@/types";
import { JobCard } from "@/components/jobs/job-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { filterJobs, getUniqueLocations, getUniqueWorkPolicies, getUniqueEmploymentTypes } from "@/data/jobs";
import { useEffect, useState, useMemo } from "react";

interface CareersPageContentProps {
  company: Company;
  jobs: Job[];
  showFilters?: boolean;
}

export function CareersPageContent({ company, jobs: initialJobs, showFilters = true }: CareersPageContentProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [workPolicyFilter, setWorkPolicyFilter] = useState<string>("all");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<string>("all");

  useEffect(() => {
    const filtered = filterJobs(initialJobs, {
      search,
      location: locationFilter && locationFilter !== "all" ? locationFilter : undefined,
      workPolicy: workPolicyFilter && workPolicyFilter !== "all" ? workPolicyFilter : undefined,
      employmentType: employmentTypeFilter && employmentTypeFilter !== "all" ? employmentTypeFilter : undefined,
    });
    setJobs(filtered);
  }, [search, locationFilter, workPolicyFilter, employmentTypeFilter, initialJobs]);

  const primaryColor = useMemo(() => company.branding.primaryColor, [company.branding.primaryColor]);
  const secondaryColor = useMemo(() => company.branding.secondaryColor, [company.branding.secondaryColor]);
  const locations = useMemo(() => getUniqueLocations(initialJobs), [initialJobs]);
  const workPolicies = useMemo(() => getUniqueWorkPolicies(initialJobs), [initialJobs]);
  const employmentTypes = useMemo(() => getUniqueEmploymentTypes(initialJobs), [initialJobs]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div
        key={`hero-${primaryColor}-${secondaryColor}-${company.name}`}
        className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        {company.branding.banner && (
          <img
            src={company.branding.banner}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          {company.branding.logo && (
            <div className="mb-6 flex justify-center">
              <img
                src={company.branding.logo}
                alt={company.name}
                className="h-20 md:h-32 w-auto object-contain drop-shadow-lg"
              />
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            {company.name}
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-8 drop-shadow-md">
            Join Our Team
          </p>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Discover exciting career opportunities and be part of something amazing
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 space-y-20">
        {company.content.sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <section
              key={section.id}
              className={`max-w-4xl mx-auto ${
                index % 2 === 0 ? "text-center" : ""
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {section.title}
              </h2>
              <div
                className="prose prose-lg md:prose-xl max-w-none text-muted-foreground leading-relaxed"
                style={{
                  fontSize: "1.125rem",
                  lineHeight: "1.75rem",
                }}
                dangerouslySetInnerHTML={{
                  __html: section.content.replace(/\n/g, "<br />"),
                }}
              />
            </section>
          ))}

        {company.branding.cultureVideo && (
          <section className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              Our Culture
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-primary/20">
              <iframe
                src={company.branding.cultureVideo.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Company Culture Video"
              />
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Open Positions</h2>
            <p className="text-lg text-muted-foreground">
              Explore our current job openings and find your perfect role
            </p>
          </div>

          {showFilters && (
            <Card className="mb-8 shadow-lg border-2">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <label htmlFor="job-search" className="sr-only">
                      Search jobs
                    </label>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="job-search"
                      placeholder="Search by job title, location, or department..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 h-12 text-base"
                      aria-label="Search jobs by title, location, or department"
                    />
                  </div>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-full md:w-[220px] h-12" aria-label="Filter by location">
                      <SelectValue placeholder="All Locations">
                        {locationFilter === "all" ? "All Locations" : locationFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={workPolicyFilter} onValueChange={setWorkPolicyFilter}>
                    <SelectTrigger className="w-full md:w-[220px] h-12" aria-label="Filter by work policy">
                      <SelectValue placeholder="Work Policy">
                        {workPolicyFilter === "all" ? "All Policies" : workPolicyFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Policies</SelectItem>
                      {workPolicies.map((policy) => (
                        <SelectItem key={policy} value={policy}>
                          {policy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={employmentTypeFilter} onValueChange={setEmploymentTypeFilter}>
                    <SelectTrigger className="w-full md:w-[220px] h-12" aria-label="Filter by employment type">
                      <SelectValue placeholder="Employment Type">
                        {employmentTypeFilter === "all" ? "All Types" : employmentTypeFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {jobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.job_slug} job={job} primaryColor={primaryColor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl font-semibold mb-2">No jobs found</p>
                <p className="text-muted-foreground mb-6">
                  No jobs match your current search criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setLocationFilter("all");
                    setWorkPolicyFilter("all");
                    setEmploymentTypeFilter("all");
                  }}
                  className="px-6 py-3 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: primaryColor,
                    color: "white",
                  }}
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

