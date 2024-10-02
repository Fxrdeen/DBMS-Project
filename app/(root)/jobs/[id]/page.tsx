"use client";

import JobDetailsPage from "@/components/id-job-page";
import { getJobs } from "@/server";
import { Job } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
const PageJob = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const result = await getJobs();
      return result as Job[];
    },
  });
  const jobId = parseInt(id as string);
  const job = data?.find((j) => j.job_id === jobId);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <div>
      <JobDetailsPage job={job as Job} />
    </div>
  );
};

export default PageJob;
