"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bid, Job } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getJobById, getJobs } from "@/server";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function JobDetailsPage({ job }: { job: Job }) {
  const { data, isLoading } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const result = await getJobs();
      return result as Job[];
    },
  });
  const { data: bids, isLoading: isLoadingBids } = useQuery<Bid[]>({
    queryKey: ["bids"],
    queryFn: async () => {
      const result = await getJobById(job.job_id);
      return result as Bid[];
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
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">{job.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{job.description}</p>
            <div>
              <h3 className="font-semibold mb-2">Required Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold">Budget: {job.budget}</p>
              <p className="text-sm text-muted-foreground">
                Deadline: {job.deadline.toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Posted by: {job.client_name}
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Apply for this Job</Button>
          </CardFooter>
        </Card>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Job Bids</CardTitle>
          </CardHeader>
          <CardContent>
            {bids && bids.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bidder</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bids?.map((bid) => (
                    <TableRow key={bid.bid_id}>
                      <TableCell>{bid.freelancer_name}</TableCell>
                      <TableCell>{bid.bid_amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            bid.status === "accepted" ? "outline" : "default"
                          }
                        >
                          {bid.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">
                No bids have been placed for this job yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
