"use client";

import { useState } from "react";
import PortfolioForm from "@/components/admin/Dashboard/PortfolioForm";
import ExperienceForm from "@/components/admin/Dashboard/ExperienceForm";
import PortfolioList from "@/components/admin/Dashboard/PortfolioList";
import ExperienceList from "@/components/admin/Dashboard/ExperienceList";
import DashboardStats from "@/components/admin/Dashboard/DashboardStats";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Portfolio {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies: string[];
}

export default function DashboardPage() {
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(
    null
  );
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );

  const handleEditPortfolio = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    // Scroll to the form
    document
      .getElementById("portfolio-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEditPortfolio = () => {
    setEditingPortfolio(null);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    // Scroll to the form
    document
      .getElementById("experience-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEditExperience = () => {
    setEditingExperience(null);
  };

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
        <div className="space-y-4 sm:space-y-6" id="portfolio-form">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
              {editingPortfolio ? "Edit Project" : "Portfolio Projects"}
            </h2>
            <Badge variant="outline" className="text-xs">
              {editingPortfolio ? "Editing" : "Create & Manage"}
            </Badge>
          </div>
          <PortfolioForm
            editingPortfolio={editingPortfolio}
            onCancelEdit={handleCancelEditPortfolio}
            onSuccess={handleCancelEditPortfolio}
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
              Project Gallery
            </h2>
          </div>
          <PortfolioList onEditPortfolio={handleEditPortfolio} />
        </div>
      </div>

      <Separator className="my-6 sm:my-8" />

      {/* Experience Section */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="space-y-4 sm:space-y-6" id="experience-form">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
              {editingExperience ? "Edit Experience" : "Work Experience"}
            </h2>
            <Badge variant="outline" className="text-xs">
              {editingExperience ? "Editing" : "Add Experience"}
            </Badge>
          </div>
          <ExperienceForm
            editingExperience={editingExperience}
            onCancelEdit={handleCancelEditExperience}
            onSuccess={handleCancelEditExperience}
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
              Career Timeline
            </h2>
          </div>
          <ExperienceList onEditExperience={handleEditExperience} />
        </div>
      </div>
    </div>
  );
}
