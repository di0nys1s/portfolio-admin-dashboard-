"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gql, useMutation } from "@apollo/client";
import { GET_PORTFOLIOS } from "./PortfolioList";
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
import { AlertCircle, Loader2 } from "lucide-react";

export const CREATE_PORTFOLIO = gql`
  mutation CreatePortfolio($input: PortfolioInput!) {
    createPortfolio(input: $input) {
      id
      title
      description
      imageUrl
      projectUrl
      githubUrl
      technologies
      featured
    }
  }
`;

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  projectUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  technologies: z.string().min(1, "Technologies are required"),
  featured: z.boolean(),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface PortfolioFormProps {
  onSuccess?: () => void;
}

export default function PortfolioForm({ onSuccess }: PortfolioFormProps) {
  const [error, setError] = useState<string | null>(null);

  const [createPortfolio] = useMutation(CREATE_PORTFOLIO, {
    onCompleted: () => {
      reset();
      setError(null);
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      setError(err.message);
    },
    refetchQueries: [{ query: GET_PORTFOLIOS }],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      featured: false,
      technologies: "",
    },
  });

  const onSubmit: SubmitHandler<PortfolioFormData> = async (data) => {
    try {
      await createPortfolio({
        variables: {
          input: {
            ...data,
            technologies: data.technologies
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item !== ""),
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
        <CardTitle className="text-xl md:text-2xl font-bold">
          Add New Portfolio Project
        </CardTitle>
        <CardDescription>
          Create a new portfolio project to showcase your work
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

          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              {...register("title")}
              id="title"
              type="text"
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register("description")}
              id="description"
              rows={3}
              placeholder="Describe your project..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                {...register("imageUrl")}
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-600">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectUrl">Project URL</Label>
              <Input
                {...register("projectUrl")}
                id="projectUrl"
                type="url"
                placeholder="https://example.com"
              />
              {errors.projectUrl && (
                <p className="text-sm text-red-600">
                  {errors.projectUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              {...register("githubUrl")}
              id="githubUrl"
              type="url"
              placeholder="https://github.com/username/repo"
            />
            {errors.githubUrl && (
              <p className="text-sm text-red-600">{errors.githubUrl.message}</p>
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

          <div className="flex items-center space-x-2">
            <input
              {...register("featured")}
              id="featured"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label
              htmlFor="featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Featured Project
            </Label>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
