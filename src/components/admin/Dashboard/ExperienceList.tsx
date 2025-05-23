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
import { Calendar, Trash2, Loader2, Edit } from "lucide-react";

export const GET_EXPERIENCES = gql`
  query GetExperiences {
    experiences {
      id
      title
      company
      location
      startDate
      endDate
      current
      description
      technologies
      createdAt
      updatedAt
    }
  }
`;

const DELETE_EXPERIENCE = gql`
  mutation DeleteExperience($id: ID!) {
    deleteExperience(id: $id)
  }
`;

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
  createdAt: string;
  updatedAt: string;
}

interface ExperienceListProps {
  onEditExperience?: (experience: Experience) => void;
}

export default function ExperienceList({
  onEditExperience,
}: ExperienceListProps) {
  const { data, loading, error } = useQuery(GET_EXPERIENCES);
  const [deleteExperience, { loading: deleting }] = useMutation(
    DELETE_EXPERIENCE,
    {
      refetchQueries: [{ query: GET_EXPERIENCES }],
    }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading experiences...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-800">
            <span>Error loading experiences: {error.message}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.experiences?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <p>No work experience found.</p>
            <p className="text-sm mt-1">
              Add your first experience to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteExperience({ variables: { id } });
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const handleEdit = (experience: Experience) => {
    if (onEditExperience) {
      onEditExperience(experience);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (months < 1) return "Less than a month";
    if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    let duration = `${years} year${years > 1 ? "s" : ""}`;
    if (remainingMonths > 0) {
      duration += ` ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
    }

    return duration;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-2xl font-bold">Work Experience</h2>
        <Badge variant="secondary" className="text-xs">
          {data.experiences.length} experience
          {data.experiences.length === 1 ? "" : "s"}
        </Badge>
      </div>

      <div className="space-y-4">
        {data.experiences.map((experience: Experience, index: number) => (
          <Card
            key={experience.id}
            className="group hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="space-y-1 min-w-0 flex-1">
                    <CardTitle className="text-lg leading-tight">
                      {experience.title}
                    </CardTitle>
                    <CardDescription className="font-medium text-gray-900">
                      {experience.company} • {experience.location}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(experience.startDate)} -{" "}
                          {experience.current
                            ? "Present"
                            : formatDate(experience.endDate!)}
                        </span>
                      </div>
                      <span>•</span>
                      <span>
                        {calculateDuration(
                          experience.startDate,
                          experience.endDate
                        )}
                      </span>
                      {experience.current && (
                        <Badge variant="default" className="text-xs ml-2">
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(experience)}
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
                        <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete your experience at{" "}
                          <strong>{experience.company}</strong>? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(experience.id)}
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

            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {experience.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {experience.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Timeline connector */}
              {index < data.experiences.length - 1 && (
                <div className="flex items-center gap-3 mt-4 pt-4">
                  <div className="w-8 flex justify-center">
                    <div className="w-px h-6 bg-gray-200"></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
