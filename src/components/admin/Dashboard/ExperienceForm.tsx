"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
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
import { AlertCircle, Loader2, Calendar, Building } from "lucide-react";

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

const experienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  current: z.boolean().default(false),
  description: z.string().min(1, "Description is required"),
  technologies: z.string(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  onSuccess?: () => void;
}

export default function ExperienceForm({ onSuccess }: ExperienceFormProps) {
  const [error, setError] = useState<string | null>(null);

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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema) as Resolver<ExperienceFormData>,
    defaultValues: {
      current: false,
    },
  });

  const current = watch("current");

  const onSubmit: SubmitHandler<ExperienceFormData> = async (data) => {
    try {
      await createExperience({
        variables: {
          input: {
            ...data,
            technologies: data.technologies
              .split(",")
              .map((item) => item.trim()),
          },
        },
      });
    } catch {
      // GraphQL errors are handled by onError callback
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Building className="h-5 w-5 md:h-6 md:w-6" />
          Add New Experience
        </CardTitle>
        <CardDescription>
          Add your work experience and professional background
        </CardDescription>
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
                placeholder="Senior Software Engineer"
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
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </Label>
              <Input {...register("startDate")} id="startDate" type="date" />
              {errors.startDate && (
                <p className="text-sm text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {!current && (
              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date
                </Label>
                <Input {...register("endDate")} id="endDate" type="date" />
                {errors.endDate && (
                  <p className="text-sm text-red-600">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            )}
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
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              {...register("description")}
              id="description"
              rows={3}
              placeholder="Describe your role, responsibilities, and achievements..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies & Skills</Label>
            <Input
              {...register("technologies")}
              id="technologies"
              type="text"
              placeholder="React, TypeScript, Node.js, AWS"
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating..." : "Add Experience"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
