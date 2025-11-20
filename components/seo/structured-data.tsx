import { Company, Job } from "@/types";

interface StructuredDataProps {
  company: Company;
  jobs: Job[];
}

export function StructuredData({ company, jobs }: StructuredDataProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: "",
    logo: company.branding.logo || "",
    sameAs: [],
  };

  const jobPostingsSchema = jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `${job.title} position at ${company.name}`,
    identifier: {
      "@type": "PropertyValue",
      name: company.name,
      value: job.job_slug,
    },
    datePosted: new Date().toISOString(),
    employmentType: job.employment_type,
    hiringOrganization: {
      "@type": "Organization",
      name: company.name,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location.split(",")[0],
        addressCountry: job.location.split(",").pop()?.trim() || "",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: job.salary_range.includes("USD")
        ? "USD"
        : job.salary_range.includes("AED")
        ? "AED"
        : job.salary_range.includes("SAR")
        ? "SAR"
        : "INR",
      value: {
        "@type": "QuantitativeValue",
        value: job.salary_range,
      },
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      {jobPostingsSchema.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

