"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Job } from "@/types";

const skillOptions = [
  "React",
  "Node.js",
  "MongoDB",
  "Python",
  "Java",
  "JavaScript",
  "Machine Learning",
  "SQL",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Web Scraping",
  "Data Analysis",
  "Mobile Development",
  "React Native",
  "Backend Development",
];

export default function JobsPage({ jobs }: { jobs: Job[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSkills.length === 0 ||
        selectedSkills.some((skill) =>
          job.skills_required.includes(skill as never)
        ))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Favorite Jobs
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover exciting opportunities that match your skills
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar with Filters */}
          <aside className="md:w-1/4">
            <div className="sticky top-8">
              <h2 className="text-2xl font-semibold mb-4">Filters</h2>
              <Input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <Separator className="my-4" />
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <div className="space-y-2">
                {skillOptions.map((skill) => (
                  <label key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={(checked) => {
                        setSelectedSkills(
                          checked
                            ? [...selectedSkills, skill]
                            : selectedSkills.filter((s) => s !== skill)
                        );
                      }}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <main className="md:w-3/4">
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <Link href={`/jobs/${job.job_id}`} key={job.job_id}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                      <CardHeader>
                        <CardTitle>{job.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {job.description}
                        </p>
                        <p className="font-semibold">Budget: {job.budget}</p>
                        <p className="text-sm text-muted-foreground">
                          Deadline: {job.deadline.toLocaleDateString()}
                        </p>
                      </CardContent>
                      <CardFooter className="flex flex-col items-start">
                        <p className="text-sm text-muted-foreground mb-2">
                          Posted by: {job.client_name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills_required[0] !== null
                            ? job.skills_required?.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))
                            : "Skills not mentioned"}
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-semibold mb-2">No jobs found</h2>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
