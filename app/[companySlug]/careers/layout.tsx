import type { Metadata } from "next";
import { getCompanyBySlug } from "@/data/companies";

type Props = {
  params: Promise<{ companySlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { companySlug } = await params;
  const company = getCompanyBySlug(companySlug);

  if (!company) {
    return {
      title: "Careers",
      description: "Explore career opportunities",
    };
  }

  return {
    title: `Careers at ${company.name}`,
    description: `Join ${company.name} and explore exciting career opportunities. Browse open positions and learn about our company culture.`,
    openGraph: {
      title: `Careers at ${company.name}`,
      description: `Join ${company.name} and explore exciting career opportunities.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Careers at ${company.name}`,
      description: `Join ${company.name} and explore exciting career opportunities.`,
    },
  };
}

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

