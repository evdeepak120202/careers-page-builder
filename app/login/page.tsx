"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { getCompanyBySlug, createCompany } from "@/data/companies";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && companyName) {
      try {
        sessionStorage.clear();
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.startsWith("careers_") || 
            key.startsWith("company_") || 
            key.startsWith("jobs_") || 
            key === "auth" || 
            key === "companySlug"
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
      } catch (error) {
        console.error("Error clearing storage:", error);
      }

      const slug = generateSlug(companyName);
      let company = getCompanyBySlug(slug);
      if (!company) {
        company = createCompany({
          slug: slug,
          name: companyName,
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
        });
      }
      
      localStorage.setItem("auth", "true");
      localStorage.setItem("companySlug", slug);
      router.push(`/${slug}/edit`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Careers Page Builder</CardTitle>
          <CardDescription>
            Sign in to manage your company's careers page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Your Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Your careers page will be available at: /{companyName ? generateSlug(companyName) : "company-slug"}/careers
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="recruiter@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

