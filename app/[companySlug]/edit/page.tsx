"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, ExternalLink, Save, Plus, Trash2, GripVertical, Edit2 } from "lucide-react";
import { Company, ContentSection, Job } from "@/types";
import { getCompanyBySlug, updateCompany } from "@/data/companies";
import { 
  getJobsByCompanySlug, 
  addJobToCompany, 
  updateJobInCompany, 
  deleteJobFromCompany,
  generateJobSlug,
  setJobsForCompany
} from "@/data/jobs-storage";
import { sampleJobs } from "@/data/jobs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const companySlug = params.companySlug as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [saving, setSaving] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      router.push("/login");
      return;
    }

    try {
      const unsavedData = sessionStorage.getItem(`company_unsaved_${companySlug}`);
      const unsavedJobs = sessionStorage.getItem(`jobs_unsaved_${companySlug}`);
      
      if (unsavedData) {
        const parsed = JSON.parse(unsavedData) as Company;
        setCompany({ ...parsed });
        
        if (unsavedJobs) {
          try {
            const parsedJobs = JSON.parse(unsavedJobs) as Job[];
            setJobs(parsedJobs);
          } catch (error) {
            console.error("Error parsing unsaved jobs:", error);
            loadJobsForCompany();
          }
        } else {
          loadJobsForCompany();
        }
        return;
      }
    } catch (error) {
      console.error("Error loading unsaved changes:", error);
    }

    const companyData = getCompanyBySlug(companySlug);
    if (companyData) {
      setCompany({ ...companyData });
      loadJobsForCompany();
    } else {
      router.push("/login");
    }

    function loadJobsForCompany() {
      let companyJobs = getJobsByCompanySlug(companySlug);
      
      if (companyJobs.length === 0) {
        companyJobs = [...sampleJobs];
        setJobsForCompany(companySlug, companyJobs);
      }
      
      const uniqueJobs = companyJobs.filter((job, index, self) =>
        index === self.findIndex((j) => j.job_slug === job.job_slug)
      );
      
      if (uniqueJobs.length !== companyJobs.length) {
        setJobsForCompany(companySlug, uniqueJobs);
      }
      
      setJobs(uniqueJobs);
    }
  }, [companySlug, router]);

  useEffect(() => {
    if (company) {
      try {
        sessionStorage.setItem(`company_unsaved_${companySlug}`, JSON.stringify(company));
        sessionStorage.setItem(`jobs_unsaved_${companySlug}`, JSON.stringify(jobs));
      } catch (error) {
        console.error("Error saving unsaved changes to sessionStorage:", error);
      }
    }
  }, [company, companySlug, jobs]);

  const handleSave = () => {
    if (!company) return;
    setSaving(true);
    const updated = updateCompany(companySlug, company);
    if (updated) {
      setCompany({ ...updated });
      try {
        sessionStorage.removeItem(`company_unsaved_${companySlug}`);
        sessionStorage.removeItem(`jobs_unsaved_${companySlug}`);
      } catch (error) {
        console.error("Error clearing unsaved changes:", error);
      }
    }
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully! Changes are now live on your public page.");
    }, 500);
  };

  const handlePreview = () => {
    router.push(`/${companySlug}/preview`);
  };

  const handleViewPublic = () => {
    window.open(`/${companySlug}/careers`, "_blank");
  };

  const addSection = () => {
    if (!company) return;
    const newSection: ContentSection = {
      id: Date.now().toString(),
      type: "custom",
      title: "New Section",
      content: "",
      order: company.content.sections.length,
    };
    setCompany({
      ...company,
      content: {
        sections: [...company.content.sections, newSection],
      },
    });
  };

  const removeSection = (sectionId: string) => {
    if (!company) return;
    setCompany({
      ...company,
      content: {
        sections: company.content.sections.filter((s) => s.id !== sectionId),
      },
    });
  };

  const updateSection = (sectionId: string, updates: Partial<ContentSection>) => {
    if (!company) return;
    setCompany({
      ...company,
      content: {
        sections: company.content.sections.map((s) =>
          s.id === sectionId ? { ...s, ...updates } : s
        ),
      },
    });
  };

  const handleAddJob = () => {
    const newJob: Job = {
      title: "",
      work_policy: "Remote",
      location: "",
      department: "",
      employment_type: "Full time",
      experience_level: "Mid-level",
      job_type: "Permanent",
      salary_range: "",
      job_slug: "",
      posted_days_ago: "Posted today",
    };
    setEditingJob(newJob);
    setIsJobDialogOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob({ ...job });
    setIsJobDialogOpen(true);
  };

  const handleDeleteJob = (jobSlug: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      deleteJobFromCompany(companySlug, jobSlug);
      setJobs(jobs.filter((j) => j.job_slug !== jobSlug));
    }
  };

  const handleSaveJob = () => {
    if (!editingJob) return;
    
    const existingSlugs = jobs.map((j) => j.job_slug).filter(Boolean);
    const jobSlug = editingJob.job_slug || generateJobSlug(editingJob.title, editingJob.location, existingSlugs);
    const jobToSave: Job = {
      ...editingJob,
      job_slug: jobSlug,
    };

    if (editingJob.job_slug) {
      updateJobInCompany(companySlug, editingJob.job_slug, jobToSave);
      setJobs(jobs.map((j) => (j.job_slug === editingJob.job_slug ? jobToSave : j)));
    } else {
      addJobToCompany(companySlug, jobToSave);
      setJobs([...jobs, jobToSave]);
    }

    setIsJobDialogOpen(false);
    setEditingJob(null);
  };

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground mb-2">Loading company data...</p>
          <p className="text-sm text-muted-foreground mb-4">
            {companySlug ? `Company: ${companySlug}` : "No company specified"}
          </p>
          <Button 
            variant="outline" 
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <p className="text-sm text-muted-foreground">Careers Page Editor</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={handleViewPublic}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Page
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList>
            <TabsTrigger value="company">Company Info</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="content">Content Sections</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company name and basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your Company Name"
                    value={company.name}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        name: e.target.value,
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    This name will appear on your public careers page
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySlug">Company Slug</Label>
                  <Input
                    id="companySlug"
                    type="text"
                    value={company.slug}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL identifier (cannot be changed)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>
                  Customize your company's brand colors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={company.branding.primaryColor}
                        onChange={(e) =>
                          setCompany({
                            ...company,
                            branding: {
                              ...company.branding,
                              primaryColor: e.target.value,
                            },
                          })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={company.branding.primaryColor}
                        onChange={(e) =>
                          setCompany({
                            ...company,
                            branding: {
                              ...company.branding,
                              primaryColor: e.target.value,
                            },
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={company.branding.secondaryColor}
                        onChange={(e) =>
                          setCompany({
                            ...company,
                            branding: {
                              ...company.branding,
                              secondaryColor: e.target.value,
                            },
                          })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={company.branding.secondaryColor}
                        onChange={(e) =>
                          setCompany({
                            ...company,
                            branding: {
                              ...company.branding,
                              secondaryColor: e.target.value,
                            },
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={company.branding.logo || ""}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        branding: {
                          ...company.branding,
                          logo: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banner">Banner Image URL</Label>
                  <Input
                    id="banner"
                    type="url"
                    placeholder="https://example.com/banner.jpg"
                    value={company.branding.banner || ""}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        branding: {
                          ...company.branding,
                          banner: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cultureVideo">Culture Video URL</Label>
                  <Input
                    id="cultureVideo"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={company.branding.cultureVideo || ""}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        branding: {
                          ...company.branding,
                          cultureVideo: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Content Sections</CardTitle>
                    <CardDescription>
                      Add and manage content sections for your careers page
                    </CardDescription>
                  </div>
                  <Button onClick={addSection}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {company.content.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => (
                    <div key={section.id} className="space-y-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Section {index + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSection(section.id)}
                          className="ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Section Type</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={section.type}
                            onChange={(e) =>
                              updateSection(section.id, {
                                type: e.target.value as ContentSection["type"],
                              })
                            }
                          >
                            <option value="about">About Us</option>
                            <option value="life">Life at Company</option>
                            <option value="benefits">Benefits</option>
                            <option value="values">Values</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={section.title}
                            onChange={(e) =>
                              updateSection(section.id, { title: e.target.value })
                            }
                            placeholder="Section title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea
                            value={section.content}
                            onChange={(e) =>
                              updateSection(section.id, { content: e.target.value })
                            }
                            placeholder="Section content"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                {company.content.sections.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No sections yet. Click "Add Section" to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Job Listings</CardTitle>
                    <CardDescription>
                      Manage job postings for your careers page
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddJob}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Job
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No jobs posted yet.</p>
                    <Button onClick={handleAddJob}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job, index) => (
                      <div
                        key={job.job_slug || `job-${index}-${job.title}`}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                📍 {job.location}
                              </span>
                              <span>•</span>
                              <span>{job.work_policy}</span>
                              <span>•</span>
                              <span>{job.employment_type}</span>
                              <span>•</span>
                              <span>{job.department}</span>
                              <span>•</span>
                              <span>{job.experience_level}</span>
                            </div>
                            <p className="text-sm font-medium mt-2">{job.salary_range}</p>
                            <p className="text-xs text-muted-foreground mt-1">{job.posted_days_ago}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditJob(job)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteJob(job.job_slug)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob?.job_slug ? "Edit Job" : "Add New Job"}</DialogTitle>
            <DialogDescription>
              {editingJob?.job_slug ? "Update job details" : "Create a new job posting"}
            </DialogDescription>
          </DialogHeader>
          {editingJob && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title *</Label>
                  <Input
                    id="job-title"
                    value={editingJob.title}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, title: e.target.value })
                    }
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-location">Location *</Label>
                  <Input
                    id="job-location"
                    value={editingJob.location}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, location: e.target.value })
                    }
                    placeholder="e.g., Berlin, Germany"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-work-policy">Work Policy</Label>
                  <select
                    id="job-work-policy"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editingJob.work_policy}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        work_policy: e.target.value as Job["work_policy"],
                      })
                    }
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-department">Department</Label>
                  <Input
                    id="job-department"
                    value={editingJob.department}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, department: e.target.value })
                    }
                    placeholder="e.g., Engineering"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-employment-type">Employment Type</Label>
                  <select
                    id="job-employment-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editingJob.employment_type}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        employment_type: e.target.value as Job["employment_type"],
                      })
                    }
                  >
                    <option value="Full time">Full time</option>
                    <option value="Part time">Part time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-experience">Experience Level</Label>
                  <select
                    id="job-experience"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editingJob.experience_level}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        experience_level: e.target.value as Job["experience_level"],
                      })
                    }
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-type">Job Type</Label>
                  <select
                    id="job-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editingJob.job_type}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        job_type: e.target.value as Job["job_type"],
                      })
                    }
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-salary">Salary Range</Label>
                <Input
                  id="job-salary"
                  value={editingJob.salary_range}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, salary_range: e.target.value })
                  }
                  placeholder="e.g., USD 80K–120K / year"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-posted">Posted</Label>
                <Input
                  id="job-posted"
                  value={editingJob.posted_days_ago}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, posted_days_ago: e.target.value })
                  }
                  placeholder="e.g., Posted today, 5 days ago"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveJob}
              disabled={!editingJob?.title || !editingJob?.location}
            >
              {editingJob?.job_slug ? "Update Job" : "Add Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

