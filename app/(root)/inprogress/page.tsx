"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Star } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { JobBids, User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { completeJob, getUserDetails, getUserPostedJobs } from "@/server";
import { useToast } from "@/hooks/use-toast";

// Mock data for in-progress jobs
const inProgressJobs = [
  {
    id: 1,
    title: "E-commerce Website Development",
    freelancer: "Alice Johnson",
    startDate: "2023-06-01",
    expectedEndDate: "2023-08-31",
    budget: "$5000",
    description:
      "Developing a full-featured e-commerce website with product management, shopping cart, and payment integration.",
  },
  {
    id: 2,
    title: "Mobile App UI Design",
    freelancer: "Bob Smith",
    startDate: "2023-07-15",
    expectedEndDate: "2023-09-15",
    budget: "$3000",
    description:
      "Creating user interface designs for a new mobile app, including wireframes and high-fidelity mockups.",
  },
  {
    id: 3,
    title: "Content Writing for Blog",
    freelancer: "Charlie Brown",
    startDate: "2023-08-01",
    expectedEndDate: "2023-10-31",
    budget: "$2000",
    description:
      "Writing a series of 20 blog posts on various topics related to digital marketing and SEO.",
  },
];

export default function InProgressPage() {
  const [jobs, setJobs] = useState(inProgressJobs);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const { user } = useUser();
  const { toast } = useToast();
  const { data: userDetails, isLoading: userDetailsLoading } = useQuery<User[]>(
    {
      queryKey: ["user"],
      queryFn: async () => {
        const result = await getUserDetails(
          user?.emailAddresses[0].emailAddress as string
        );
        return result as User[];
      },
      enabled: !!user?.emailAddresses[0].emailAddress,
    }
  );
  const { data: postedJobs, isLoading: isPostedJobsLoading } = useQuery({
    queryKey: ["postedJobs"],
    queryFn: async () => {
      const result = await getUserPostedJobs(
        userDetails?.[0].user_id as number
      );
      return result as JobBids[];
    },
    enabled: !!userDetails?.[0].user_id,
  });
  const completeMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const result = await completeJob(jobId);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job marked as completed successfully",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: `Failed to mark job as completed`,
        variant: "destructive",
      });
    },
  });

  const handleOpenCompleteDialog = (job: any) => {
    setSelectedJob(job);
    setIsCompleteModalOpen(true);
  };

  const handleOpenFeedback = (job: any) => {
    setSelectedJob(job);
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = () => {
    // In a real application, you would send this feedback to the backend
  };

  if (userDetailsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Jobs In Progress
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Monitor and manage your ongoing projects
          </p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {postedJobs?.map((job) => (
              <Card key={job.job_id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    Freelancer:{" "}
                    {
                      job.bids.filter((bid) => bid.status === "accepted")[0]
                        .freelancer_name
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Deadline:</strong>{" "}
                    {job.deadline.toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Budget:</strong> {job.budget}
                  </p>
                  <p className="mt-2">{job.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {job.job_status === "in progress" ? (
                    <Button
                      variant="outline"
                      onClick={() => handleOpenCompleteDialog(job)}
                    >
                      Complete Job
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1>Job has been completed</h1>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  )}

                  <Button
                    onClick={() => handleOpenFeedback(job)}
                    disabled={job.job_status === "in progress"}
                  >
                    Give Feedback
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Job Confirmation Modal */}
      <Dialog open={isCompleteModalOpen} onOpenChange={setIsCompleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Job</DialogTitle>
            <DialogDescription>
              Are you satisfied with the project "{selectedJob?.title}" by{" "}
              {selectedJob?.freelancer}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCompleteModalOpen(false)}
            >
              No, Keep in Progress
            </Button>
            <Button
              type="button"
              onClick={() => {
                completeMutation.mutate(selectedJob.job_id);
                setIsCompleteModalOpen(false);
              }}
            >
              Yes, Mark as Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give Feedback</DialogTitle>
            <DialogDescription>
              Rate your experience and provide feedback for{" "}
              {selectedJob?.freelancer}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
