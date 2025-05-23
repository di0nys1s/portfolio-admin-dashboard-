"use client";

import { useQuery, gql } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, FolderOpen, Loader2, TrendingUp } from "lucide-react";

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    portfolios {
      id
      featured
      technologies
    }
    experiences {
      id
      current
      technologies
    }
  }
`;

interface Portfolio {
  id: string;
  featured: boolean;
  technologies: string[];
}

interface Experience {
  id: string;
  current: boolean;
  technologies: string[];
}

interface DashboardStatsData {
  portfolios: Portfolio[];
  experiences: Experience[];
}

export default function DashboardStats() {
  const { data, loading, error } =
    useQuery<DashboardStatsData>(GET_DASHBOARD_STATS);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Loading...
              </CardTitle>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Error
              </CardTitle>
              <div className="h-4 w-4 text-red-500">!</div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Failed to load</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = {
    totalProjects: data?.portfolios?.length || 0,
    featuredProjects: data?.portfolios?.filter((p) => p.featured)?.length || 0,
    totalExperiences: data?.experiences?.length || 0,
    currentJobs: data?.experiences?.filter((e) => e.current)?.length || 0,
    totalTechnologies: new Set([
      ...(data?.portfolios?.flatMap((p) => p.technologies) || []),
      ...(data?.experiences?.flatMap((e) => e.technologies) || []),
    ]).size,
  };

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Total Projects
          </CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {stats.totalProjects}
          </div>
          <p className="text-xs text-muted-foreground">Portfolio projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Work Experience
          </CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {stats.totalExperiences}
          </div>
          <div className="text-xs text-muted-foreground">
            Professional roles
            {stats.currentJobs > 0 && (
              <Badge variant="outline" className="ml-1 text-xs">
                {stats.currentJobs} current
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Featured Projects
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {stats.featuredProjects}
          </div>
          <p className="text-xs text-muted-foreground">
            Highlighted work
            {stats.totalProjects > 0 && (
              <span className="ml-1">
                (
                {Math.round(
                  (stats.featuredProjects / stats.totalProjects) * 100
                )}
                %)
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Technologies
          </CardTitle>
          <Plus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {stats.totalTechnologies}
          </div>
          <p className="text-xs text-muted-foreground">Skills & tools</p>
        </CardContent>
      </Card>
    </div>
  );
}
