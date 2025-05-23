import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Briefcase, FolderOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Portfolio Admin
          </h1>
          <p className="text-xl text-gray-600">
            Manage your professional portfolio and work experience
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <FolderOpen className="h-6 w-6" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>
              Create, edit, and manage your portfolio projects and work
              experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FolderOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Portfolio Projects</p>
                  <p className="text-sm text-gray-600">Showcase your work</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Briefcase className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Work Experience</p>
                  <p className="text-sm text-gray-600">Track your career</p>
                </div>
              </div>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          Built with Next.js, TypeScript, GraphQL, and MongoDB
        </div>
      </div>
    </div>
  );
}
