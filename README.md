# Careers Page Builder

A simple tool to build and customize your company's careers page. No backend needed - everything runs in the browser and saves to localStorage.

## What I Built

Basically a careers page builder where you can:
- Customize your company branding (colors, logo, banner)
- Add content sections (About Us, Benefits, Values, etc.)
- Manage job listings (add, edit, delete)
- See a live preview of your public page
- Everything saves automatically to your browser

The public careers page has:
- Hero section with your branding
- Custom content sections
- Job listings with filters (search, location, work policy, employment type)
- SEO-friendly structured data

## How to Run

### Prerequisites

You need Node.js installed (v18 or higher should work).

### Setup

1. Clone or download this repo
2. Open terminal in the project folder
3. Run `npm install` to get all the dependencies
4. Run `npm run dev` to start the dev server
5. Open http://localhost:3000 in your browser

### Building for Production

```bash
npm run build
npm start
```

This creates an optimized build. The `start` command runs the production server.

## Step-by-Step User Guide

### First Time Setup

1. Go to http://localhost:3000/login
2. Enter your company name (e.g., "My Company")
3. Enter any email (doesn't matter, not validated)
4. Enter any password (doesn't matter, not validated)
5. Click "Sign In"

This creates your company and takes you to the editor.

### Editing Your Company Info

1. In the editor, click the "Company Info" tab
2. Change your company name if needed
3. The slug is auto-generated and can't be changed (it's your URL identifier)

### Customizing Branding

1. Click the "Branding" tab
2. Pick your primary color (the main brand color)
3. Pick your secondary color (used for gradients)
4. Add your logo URL (must be a full URL like https://example.com/logo.png)
5. Add a banner image URL (optional, shows in hero section)
6. Add a culture video URL (optional, YouTube link)

### Adding Content Sections

1. Click the "Content Sections" tab
2. Click "Add Section"
3. Choose a section type (About Us, Life at Company, Benefits, Values, or Custom)
4. Enter a title
5. Enter your content (plain text)
6. You can add multiple sections and delete ones you don't want

### Managing Jobs

1. Click the "Jobs" tab
2. Click "Add Job"
3. Fill in the job details:
   - Job Title (required)
   - Location (required)
   - Work Policy (Remote/Hybrid/On-site)
   - Department
   - Employment Type (Full time/Part time/Contract)
   - Experience Level (Junior/Mid-level/Senior)
   - Job Type (Permanent/Temporary/Internship)
   - Salary Range (free text, like "USD 80K-120K / year")
   - Posted date (free text, like "Posted today")
4. Click "Add Job" to save

To edit a job, click the edit icon. To delete, click the trash icon.

### Previewing Your Page

1. Click the "Preview" button in the top right
2. This shows exactly how your public page will look
3. You can test the filters and see how everything renders

### Viewing Your Public Page

1. Click "View Public Page" button
2. Or go directly to `http://localhost:3000/[your-company-slug]/careers`
3. This is the page job seekers will see

### Saving Changes

- Changes are auto-saved to sessionStorage as you type
- Click "Save Changes" to make them permanent (saves to localStorage)
- If you refresh without saving, your unsaved changes will be restored from sessionStorage

## Improvement Plan

- Add image upload instead of just URLs
- Better validation for forms (show errors inline)
- Markdown support in content sections
- Drag and drop to reorder sections
- Export/import company data as JSON
- Real authentication (maybe Auth0 or similar)
- Backend API to store data in database
- Multi-user support (multiple people can edit)
- Job application form/flow
- Analytics (track page views, job clicks)
- Email notifications when jobs are posted
- Multi-company admin dashboard
- ATS integrations (Greenhouse, Lever, etc.)
- Custom domain support
- Advanced SEO tools
- A/B testing for different page layouts
- Mobile app for managing jobs on the go
