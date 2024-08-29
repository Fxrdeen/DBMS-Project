"use client";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () =>
      fetch("http://localhost:8080/user").then((res) => res.json()),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-y-5">
      {data?.map((item) => (
        <div className="flex flex-col">
          <h1 className="text-2xl">{item.name}</h1>
          <h1 className="text-2xl">{item.email}</h1>
          <h1 className="text-2xl">{item.clerkId}</h1>
        </div>
      ))}
    </div>
  );
}
