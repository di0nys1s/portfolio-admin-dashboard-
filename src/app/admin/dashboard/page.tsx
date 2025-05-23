import { Metadata } from "next";
import PortfolioForm from "@/components/admin/Dashboard/PortfolioForm";
import ExperienceForm from "@/components/admin/Dashboard/ExperienceForm";
import PortfolioList from "@/components/admin/Dashboard/PortfolioList";
import ExperienceList from "@/components/admin/Dashboard/ExperienceList";
import DashboardStats from "@/components/admin/Dashboard/DashboardStats";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// GraphQL query to fetch counts for metadata
const GET_DASHBOARD_STATS = `
  query GetDashboardStats {
    portfolios {
      id
      featured
    }
    experiences {
      id
      current
    }
  }
`;

interface Portfolio {
  id: string;
  featured: boolean;
}

interface Experience {
  id: string;
  current: boolean;
}

interface DashboardStatsResponse {
  portfolios: Portfolio[];
  experiences: Experience[];
}

async function fetchDashboardStats() {
  try {
    const response = await fetch("http://localhost:3000/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_DASHBOARD_STATS,
      }),
      cache: "no-store", // Always fetch fresh data for metadata
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    const { data }: { data: DashboardStatsResponse } = await response.json();
    return {
      totalProjects: data?.portfolios?.length || 0,
      featuredProjects:
        data?.portfolios?.filter((p: Portfolio) => p.featured)?.length || 0,
      totalExperiences: data?.experiences?.length || 0,
      currentJobs:
        data?.experiences?.filter((e: Experience) => e.current)?.length || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats for metadata:", error);
    return {
      totalProjects: 0,
      featuredProjects: 0,
      totalExperiences: 0,
      currentJobs: 0,
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const stats = await fetchDashboardStats();

  const title = `Admin Dashboard - ${stats.totalProjects} Projects, ${stats.totalExperiences} Experiences`;
  const description = `Manage your portfolio with ${
    stats.totalProjects
  } projects (${stats.featuredProjects} featured) and ${
    stats.totalExperiences
  } work experiences${
    stats.currentJobs > 0
      ? ` including ${stats.currentJobs} current position${
          stats.currentJobs > 1 ? "s" : ""
        }`
      : ""
  }. Create, edit, and organize your professional portfolio.`;

  return {
    title,
    description,
    keywords: [
      "portfolio",
      "dashboard",
      "admin",
      "projects",
      "experience",
      "management",
      "professional",
      "work history",
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Manage your portfolio projects and work experience
        </p>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Portfolio Section */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 mb-6 sm:mb-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
              Portfolio Projects
            </h2>
            <Badge variant="outline" className="text-xs">
              Create & Manage
            </Badge>
          </div>
          <PortfolioForm />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
              Project Gallery
            </h2>
          </div>
          <PortfolioList />
        </div>
      </div>

      <Separator className="my-6 sm:my-8" />

      {/* Experience Section */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
              Work Experience
            </h2>
            <Badge variant="outline" className="text-xs">
              Add Experience
            </Badge>
          </div>
          <ExperienceForm />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
              Career Timeline
            </h2>
          </div>
          <ExperienceList />
        </div>
      </div>
    </div>
  );
}
