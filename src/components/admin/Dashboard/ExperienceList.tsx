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
import { Calendar, MapPin, Trash2, Clock, Loader2 } from "lucide-react";

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

export const DELETE_EXPERIENCE = gql`
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
  endDate?: string | null;
  current: boolean;
  description: string;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ExperienceList() {
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
            <p>No experience items found.</p>
            <p className="text-sm mt-1">
              Add your first job experience to get started!
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const calculateDuration = (
    startDate: string,
    endDate?: string | null,
    current?: boolean
  ) => {
    const start = new Date(startDate);
    const end = current ? new Date() : endDate ? new Date(endDate) : new Date();

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${
        months > 0 ? `${months} month${months > 1 ? "s" : ""}` : ""
      }`;
    }
    return `${months} month${months > 1 ? "s" : ""}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-2xl font-bold">Work Experience</h2>
        <Badge variant="secondary" className="text-xs">
          {data.experiences.length} position
          {data.experiences.length === 1 ? "" : "s"}
        </Badge>
      </div>

      <div className="space-y-4">
        {data.experiences.map((experience: Experience) => (
          <Card
            key={experience.id}
            className="group hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl leading-tight truncate">
                    {experience.title}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {experience.company} • {experience.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground min-w-0">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {formatDate(experience.startDate)} -{" "}
                        {experience.current
                          ? "Present"
                          : experience.endDate
                          ? formatDate(experience.endDate)
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                          {calculateDuration(
                            experience.startDate,
                            experience.endDate,
                            experience.current
                          )}
                        </Badge>
                      </div>
                      {experience.current && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0 ml-2"
                      disabled={deleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this work experience?
                        This action cannot be undone.
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
            </CardHeader>

            <CardContent className="space-y-4">
              <CardDescription className="text-sm sm:text-base leading-relaxed">
                {experience.description}
              </CardDescription>

              <div className="flex flex-wrap gap-1">
                {experience.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
