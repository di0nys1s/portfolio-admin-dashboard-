"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gql, useMutation } from "@apollo/client";
import { GET_EXPERIENCES } from "./ExperienceList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Building, Loader2, X } from "lucide-react";

export const CREATE_EXPERIENCE = gql`
  mutation CreateExperience($input: ExperienceInput!) {
    createExperience(input: $input) {
      id
      title
      company
      location
      startDate
      endDate
      current
      description
      technologies
    }
  }
`;

export const UPDATE_EXPERIENCE = gql`
  mutation UpdateExperience($id: ID!, $input: ExperienceInput!) {
    updateExperience(id: $id, input: $input) {
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

const experienceSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().min(1, "Description is required"),
  technologies: z.string().min(1, "Technologies are required"),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

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

interface ExperienceFormProps {
  editingExperience?: Experience | null;
  onCancelEdit?: () => void;
  onSuccess?: () => void;
}

export default function ExperienceForm({
  editingExperience,
  onCancelEdit,
  onSuccess,
}: ExperienceFormProps) {
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!editingExperience;

  const [createExperience] = useMutation(CREATE_EXPERIENCE, {
    onCompleted: () => {
      reset();
      setError(null);
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      setError(err.message);
    },
    refetchQueries: [{ query: GET_EXPERIENCES }],
  });

  const [updateExperience] = useMutation(UPDATE_EXPERIENCE, {
    onCompleted: () => {
      reset();
      setError(null);
      if (onCancelEdit) onCancelEdit();
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      setError(err.message);
    },
    refetchQueries: [{ query: GET_EXPERIENCES }],
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      current: false,
      technologies: "",
    },
  });

  const currentJob = watch("current");

  // Populate form when editing
  useEffect(() => {
    if (editingExperience) {
      setValue("title", editingExperience.title);
      setValue("company", editingExperience.company);
      setValue("location", editingExperience.location);
      setValue("startDate", editingExperience.startDate);
      setValue("endDate", editingExperience.endDate || "");
      setValue("current", editingExperience.current);
      setValue("description", editingExperience.description);
      setValue("technologies", editingExperience.technologies.join(", "));
    }
  }, [editingExperience, setValue]);

  const onSubmit: SubmitHandler<ExperienceFormData> = async (data) => {
    try {
      const input = {
        ...data,
        technologies: data.technologies
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
        endDate: data.current ? null : data.endDate,
      };

      if (isEditing && editingExperience) {
        await updateExperience({
          variables: { id: editingExperience.id, input },
        });
      } else {
        await createExperience({
          variables: { input },
        });
      }
    } catch {
      // GraphQL errors are handled by onError callback
    }
  };

  const handleCancel = () => {
    reset();
    setError(null);
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">
                {isEditing ? "Edit Work Experience" : "Add Work Experience"}
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your work experience details"
                  : "Add your professional work experience"}
              </CardDescription>
            </div>
          </div>
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                {...register("title")}
                id="title"
                type="text"
                placeholder="Software Engineer"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                {...register("company")}
                id="company"
                type="text"
                placeholder="Company Name"
              />
              {errors.company && (
                <p className="text-sm text-red-600">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              {...register("location")}
              id="location"
              type="text"
              placeholder="San Francisco, CA"
            />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input {...register("startDate")} id="startDate" type="date" />
              {errors.startDate && (
                <p className="text-sm text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                {...register("endDate")}
                id="endDate"
                type="date"
                disabled={currentJob}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              {...register("current")}
              id="current"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label
              htmlFor="current"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I currently work here
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register("description")}
              id="description"
              rows={4}
              placeholder="Describe your role and responsibilities..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies</Label>
            <Input
              {...register("technologies")}
              id="technologies"
              type="text"
              placeholder="React, TypeScript, Node.js"
            />
            <p className="text-sm text-gray-500">
              Separate technologies with commas
            </p>
            {errors.technologies && (
              <p className="text-sm text-red-600">
                {errors.technologies.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={isEditing ? "flex-1" : "w-full"}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update Experience"
                : "Add Experience"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
