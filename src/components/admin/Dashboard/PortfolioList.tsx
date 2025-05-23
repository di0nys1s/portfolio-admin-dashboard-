"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ExternalLink,
  Github,
  Trash2,
  Star,
  Loader2,
  Edit,
} from "lucide-react";

export const GET_PORTFOLIOS = gql`
  query GetPortfolios {
    portfolios {
      id
      title
      description
      imageUrl
      projectUrl
      githubUrl
      technologies
      featured
      createdAt
      updatedAt
    }
  }
`;

const DELETE_PORTFOLIO = gql`
  mutation DeletePortfolio($id: ID!) {
    deletePortfolio(id: $id)
  }
`;

interface Portfolio {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioListProps {
  onEditPortfolio?: (portfolio: Portfolio) => void;
}

export default function PortfolioList({ onEditPortfolio }: PortfolioListProps) {
  const { data, loading, error } = useQuery(GET_PORTFOLIOS);
  const [deletePortfolio, { loading: deleting }] = useMutation(
    DELETE_PORTFOLIO,
    {
      refetchQueries: [{ query: GET_PORTFOLIOS }],
    }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading portfolios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-800">
            <span>Error loading portfolios: {error.message}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.portfolios?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <p>No portfolio items found.</p>
            <p className="text-sm mt-1">
              Create your first project to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePortfolio({ variables: { id } });
    } catch (error) {
      console.error("Error deleting portfolio:", error);
    }
  };

  const handleEdit = (portfolio: Portfolio) => {
    if (onEditPortfolio) {
      onEditPortfolio(portfolio);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-2xl font-bold">Portfolio Projects</h2>
        <Badge variant="secondary" className="text-xs">
          {data.portfolios.length} project
          {data.portfolios.length === 1 ? "" : "s"}
        </Badge>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {data.portfolios.map((portfolio: Portfolio) => (
          <Card
            key={portfolio.id}
            className="group hover:shadow-lg transition-shadow duration-200 flex flex-col"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                  <CardTitle className="text-lg leading-tight truncate">
                    {portfolio.title}
                  </CardTitle>
                  {portfolio.featured && (
                    <Badge variant="default" className="w-fit">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(portfolio)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Portfolio Project
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;
                          {portfolio.title}
                          &quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(portfolio.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col">
              <CardDescription className="line-clamp-3 flex-1">
                {portfolio.description}
              </CardDescription>

              <div className="flex flex-wrap gap-1">
                {portfolio.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2 mt-auto">
                {portfolio.projectUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 min-w-0"
                  >
                    <a
                      href={portfolio.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1 shrink-0" />
                      <span className="truncate">View</span>
                    </a>
                  </Button>
                )}
                {portfolio.githubUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 min-w-0"
                  >
                    <a
                      href={portfolio.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Github className="h-4 w-4 mr-1 shrink-0" />
                      <span className="truncate">Code</span>
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
