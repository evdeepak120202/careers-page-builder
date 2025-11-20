import { Company } from "@/types";

const companies: Map<string, Company> = new Map();

function loadCompaniesFromStorage() {
  if (typeof window === "undefined") return;
  
  try {
    const stored = localStorage.getItem("careers_companies");
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([slug, company]) => {
        companies.set(slug, company as Company);
      });
    }
  } catch (error) {
    console.error("Error loading companies from localStorage:", error);
  }
}

function saveCompaniesToStorage() {
  if (typeof window === "undefined") return;
  
  try {
    const companiesObj = Object.fromEntries(companies);
    localStorage.setItem("careers_companies", JSON.stringify(companiesObj));
  } catch (error) {
    console.error("Error saving companies to localStorage:", error);
  }
}

const defaultCompany: Company = {
  id: "1",
  slug: "whitecarrot",
  name: "WhiteCarrort",
  branding: {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
  },
  content: {
    sections: [
      {
        id: "1",
        type: "about",
        title: "About Us",
        content:
          "We're a forward-thinking company dedicated to innovation and excellence. Our team of passionate professionals works together to create solutions that make a difference.",
        order: 0,
      },
      {
        id: "2",
        type: "values",
        title: "Our Values",
        content:
          "Integrity, Innovation, and Impact guide everything we do. We believe in building a culture where everyone can thrive and contribute their best work.",
        order: 1,
      },
      {
        id: "3",
        type: "benefits",
        title: "Benefits & Perks",
        content:
          "We offer competitive salaries, comprehensive health benefits, flexible working arrangements, professional development opportunities, and a supportive work environment.",
        order: 2,
      },
    ],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

loadCompaniesFromStorage();
if (!companies.has(defaultCompany.slug)) {
  companies.set(defaultCompany.slug, defaultCompany);
  saveCompaniesToStorage();
}

export function getCompanyBySlug(slug: string): Company | null {
  if (typeof window !== "undefined" && !companies.has(slug)) {
    loadCompaniesFromStorage();
  }
  
  const company = companies.get(slug);
  if (!company) {
    console.warn(`Company with slug "${slug}" not found. Available companies:`, Array.from(companies.keys()));
  }
  return company || null;
}

export function updateCompany(slug: string, updates: Partial<Company>): Company | null {
  if (typeof window !== "undefined" && !companies.has(slug)) {
    loadCompaniesFromStorage();
  }
  
  const company = companies.get(slug);
  if (!company) {
    console.error(`Cannot update: Company with slug "${slug}" not found`);
    return null;
  }

  const updated = {
    ...company,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  companies.set(slug, updated);
  saveCompaniesToStorage();
  console.log(`Company "${slug}" updated successfully`, updated);
  return updated;
}

export function createCompany(company: Omit<Company, "id" | "createdAt" | "updatedAt">): Company {
  const newCompany: Company = {
    ...company,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  companies.set(company.slug, newCompany);
  saveCompaniesToStorage();
  console.log(`Company "${company.slug}" created successfully`, newCompany);
  return newCompany;
}

