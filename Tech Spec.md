# Tech Spec

## Assumptions

- This is a client-side only app, no backend needed for now
- Data persistence happens in localStorage (good enough for MVP)
- One company per browser session basically
- Authentication is super simple - just check if localStorage has "auth" key
- Companies are identified by slug (URL-friendly name)
- Jobs belong to companies via company slug
- All styling uses Tailwind CSS
- Using Next.js 16 with App Router

## Architecture

### Overall Structure

It's a Next.js app with these main routes:
- `/login` - Simple login/create company page
- `/[companySlug]/careers` - Public careers page
- `/[companySlug]/edit` - Admin editor page
- `/[companySlug]/preview` - Preview mode (same as careers but for testing)

### Data Layer

Everything lives in localStorage:
- `careers_companies` - stores all company data as JSON
- `careers_company_jobs` - stores jobs by company slug
- `auth` - just a flag "true" if logged in
- `companySlug` - current company being edited

Two main data modules:
- `data/companies.ts` - handles company CRUD, uses a Map in memory, syncs to localStorage
- `data/jobs-storage.ts` - handles job CRUD per company, also uses Map + localStorage

### Component Structure

- `components/careers/careers-page-content.tsx` - Main public page component
- `components/jobs/job-card.tsx` - Individual job card
- `components/seo/structured-data.tsx` - JSON-LD for SEO
- `components/ui/*` - shadcn/ui components (buttons, cards, etc)

### State Management

Just React useState and useEffect. No Redux or anything fancy. 
- Edit page keeps unsaved changes in sessionStorage
- Auto-saves to sessionStorage on every change
- Only writes to localStorage when user clicks "Save Changes"

## Schema

### Company

```typescript
{
  id: string
  slug: string  // URL identifier, like "whitecarrot"
  name: string
  branding: {
    primaryColor: string  // hex color
    secondaryColor: string  // hex color
    logo?: string  // URL
    banner?: string  // URL
    cultureVideo?: string  // YouTube URL
  }
  content: {
    sections: ContentSection[]
  }
  createdAt: string  // ISO date
  updatedAt: string  // ISO date
}
```

### ContentSection

```typescript
{
  id: string
  type: "about" | "life" | "benefits" | "values" | "custom"
  title: string
  content: string  // plain text or markdown
  order: number
}
```

### Job

```typescript
{
  title: string
  work_policy: "Remote" | "Hybrid" | "On-site"
  location: string
  department: string
  employment_type: "Full time" | "Part time" | "Contract"
  experience_level: "Junior" | "Mid-level" | "Senior"
  job_type: "Permanent" | "Temporary" | "Internship"
  salary_range: string
  job_slug: string  // URL-friendly identifier
  posted_days_ago: string  // like "5 days ago"
}
```

### Storage Format

localStorage structure:
```json
{
  "careers_companies": {
    "whitecarrot": { /* Company object */ },
    "othercompany": { /* Company object */ }
  },
  "careers_company_jobs": {
    "whitecarrot": [ /* Job[] */ ],
    "othercompany": [ /* Job[] */ ]
  }
}
```

## Test Plan

### Manual Testing Checklist

**Login Flow**
- [ ] Can create new company with name, email, password
- [ ] Slug is generated correctly from company name
- [ ] Redirects to edit page after login
- [ ] Existing company loads correctly

**Edit Page - Company Info**
- [ ] Can update company name
- [ ] Slug is read-only
- [ ] Changes save to localStorage on "Save Changes"
- [ ] Unsaved changes persist in sessionStorage

**Edit Page - Branding**
- [ ] Can change primary color (color picker + text input)
- [ ] Can change secondary color
- [ ] Can add logo URL
- [ ] Can add banner URL
- [ ] Can add culture video URL
- [ ] Changes reflect in preview

**Edit Page - Content Sections**
- [ ] Can add new section
- [ ] Can delete section
- [ ] Can edit section title and content
- [ ] Can change section type
- [ ] Sections maintain order

**Edit Page - Jobs**
- [ ] Can add new job
- [ ] Can edit existing job
- [ ] Can delete job
- [ ] Job slug auto-generates from title + location
- [ ] All job fields save correctly
- [ ] Jobs persist after page refresh

**Public Careers Page**
- [ ] Displays company name and branding
- [ ] Shows all content sections
- [ ] Lists all jobs
- [ ] Search filters jobs by title
- [ ] Location filter works
- [ ] Work policy filter works
- [ ] Employment type filter works
- [ ] Filters can be combined
- [ ] Shows "no jobs found" when filters match nothing
- [ ] Structured data (JSON-LD) is present

**Preview Page**
- [ ] Same as careers page but for testing
- [ ] Shows unsaved changes from edit page

**Data Persistence**
- [ ] Company data survives page refresh
- [ ] Job data survives page refresh
- [ ] Multiple companies can exist
- [ ] Data doesn't leak between companies

**Edge Cases**
- [ ] Empty company name shows error
- [ ] Invalid color codes handled gracefully
- [ ] Missing logo/banner doesn't break page
- [ ] Empty job list shows placeholder
- [ ] Very long job titles don't break layout
- [ ] Special characters in company name generate valid slug

### Known Limitations

- No real authentication (anyone can access edit page if they know the URL)
- No data validation beyond basic HTML5 required fields
- No image upload (only URLs)
- No markdown rendering in content sections (just plain text)
- No job application flow (just displays jobs)
- localStorage has size limits (~5-10MB)
- No multi-user support
- No version history

