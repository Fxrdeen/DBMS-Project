"use client";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/server";
import { Job } from "@/types";
import { Loader2 } from "lucide-react";
import JobsPage from "@/components/app-find-jobs-page";

const JobPage = () => {
  const { data, isLoading } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const result = await getJobs();
      return result as Job[];
    },
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <JobsPage jobs={data as Job[]} />
    </div>
  );
};

export default JobPage;
