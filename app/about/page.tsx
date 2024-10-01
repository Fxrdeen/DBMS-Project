"use client";
import { getJobs } from "@/server";
import { Job } from "@/types";
import { useQuery } from "@tanstack/react-query";

const AboutPage = () => {
  const { data, isLoading } = useQuery<Job[]>({
    queryKey: ["user"],
    queryFn: async () => {
      const result = await getJobs();
      return result as Job[];
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>{JSON.stringify(data)}</div>;
};

export default AboutPage;
