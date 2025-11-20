import { Job } from "@/types";

const companyJobs: Map<string, Job[]> = new Map();

function loadJobsFromStorage() {
  if (typeof window === "undefined") return;
  
  try {
    const stored = localStorage.getItem("careers_company_jobs");
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([companySlug, jobs]) => {
        companyJobs.set(companySlug, jobs as Job[]);
      });
    }
  } catch (error) {
    console.error("Error loading jobs from localStorage:", error);
  }
}

function saveJobsToStorage() {
  if (typeof window === "undefined") return;
  
  try {
    const jobsObj = Object.fromEntries(companyJobs);
    localStorage.setItem("careers_company_jobs", JSON.stringify(jobsObj));
  } catch (error) {
    console.error("Error saving jobs to localStorage:", error);
  }
}

if (typeof window !== "undefined") {
  loadJobsFromStorage();
}

export function getJobsByCompanySlug(companySlug: string): Job[] {
  if (typeof window !== "undefined" && !companyJobs.has(companySlug)) {
    loadJobsFromStorage();
  }
  
  return companyJobs.get(companySlug) || [];
}

export function setJobsForCompany(companySlug: string, jobs: Job[]): void {
  companyJobs.set(companySlug, jobs);
  saveJobsToStorage();
}

export function addJobToCompany(companySlug: string, job: Job): void {
  const jobs = getJobsByCompanySlug(companySlug);
  jobs.push(job);
  setJobsForCompany(companySlug, jobs);
}

export function updateJobInCompany(companySlug: string, jobSlug: string, updates: Partial<Job>): boolean {
  const jobs = getJobsByCompanySlug(companySlug);
  const index = jobs.findIndex((j) => j.job_slug === jobSlug);
  
  if (index === -1) return false;
  
  jobs[index] = { ...jobs[index], ...updates };
  setJobsForCompany(companySlug, jobs);
  return true;
}

export function deleteJobFromCompany(companySlug: string, jobSlug: string): boolean {
  const jobs = getJobsByCompanySlug(companySlug);
  const filtered = jobs.filter((j) => j.job_slug !== jobSlug);
  
  if (filtered.length === jobs.length) return false;
  
  setJobsForCompany(companySlug, filtered);
  return true;
}

export function generateJobSlug(title: string, location: string, existingSlugs: string[] = []): string {
  let base = `${title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")}-${location.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")}`;
  base = base.replace(/^-+|-+$/g, "");
  
  let slug = base;
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  
  return slug;
}

