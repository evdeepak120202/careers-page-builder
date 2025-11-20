export interface Job {
  title: string;
  work_policy: "Remote" | "Hybrid" | "On-site";
  location: string;
  department: string;
  employment_type: "Full time" | "Part time" | "Contract";
  experience_level: "Junior" | "Mid-level" | "Senior";
  job_type: "Permanent" | "Temporary" | "Internship";
  salary_range: string;
  job_slug: string;
  posted_days_ago: string;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  branding: CompanyBranding;
  content: PageContent;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyBranding {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  banner?: string;
  cultureVideo?: string;
}

export interface PageContent {
  sections: ContentSection[];
}

export interface ContentSection {
  id: string;
  type: "about" | "life" | "benefits" | "values" | "custom";
  title: string;
  content: string;
  order: number;
}

export interface User {
  id: string;
  email: string;
  companyId: string;
  role: "recruiter" | "admin";
}

