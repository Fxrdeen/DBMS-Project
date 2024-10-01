"use client";
import { getData } from "@/server";

import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

const AboutPage = () => {
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ["user"],
    queryFn: async () => {
      const result = await getData();
      return result as User[];
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>{data?.map((user) => user.name).join(", ")}</div>;
};

export default AboutPage;
