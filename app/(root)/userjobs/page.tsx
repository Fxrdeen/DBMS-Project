"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  acceptBid,
  completeJob,
  getAppliedJobs,
  getUserDetails,
  getUserPostedJobs,
  rejectBid,
} from "@/server";
import { Loader, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Bid, JobBids, User, userBids } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function UserJobsPage() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const { user } = useUser();

  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };
  const rejectMutation = useMutation({
    mutationFn: async (bidId: number) => {
      const result = await rejectBid(bidId);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bid rejected successfully",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: `Failed to reject bid`,
        variant: "destructive",
      });
    },
  });
  const acceptMutation = useMutation({
    mutationFn: async (bidId: number) => {
      const result = await acceptBid(bidId);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bid accepted successfully",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: `Failed to accept bid`,
        variant: "destructive",
      });
    },
  });
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
  const handleManageJob = (job: any) => {
    setSelectedJob(job);
    setIsManageModalOpen(true);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const result = await getAppliedJobs(userDetails?.[0].user_id as number);
      return result as userBids[];
    },
    enabled: !!userDetails?.[0].user_id,
  });
  const [activeTab, setActiveTab] = useState(
    userDetails?.[0].role === "freelancer" ? "applied" : "posted"
  );
  useEffect(() => {
    if (userDetails?.[0]?.role) {
      setActiveTab(userDetails[0].role === "freelancer" ? "applied" : "posted");
    }
  }, [userDetails]);
  if (userDetailsLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin w-10 h-10" />
      </div>
    );
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Job Dashboard
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            {userDetails?.[0].role === "freelancer"
              ? "Manage your job applications and postings"
              : "Manage your job postings"}
          </p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              {userDetails?.[0].role === "freelancer" && (
                <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
              )}
              <TabsTrigger value="posted">Posted Jobs</TabsTrigger>
            </TabsList>
            {userDetails?.[0]?.role === "freelancer" && (
              <TabsContent value="applied">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="animate-spin w-8 h-8" />
                  </div>
                ) : data && data.length > 0 ? (
                  <div className="grid gap-6 mt-6">
                    {data.map((job: userBids) => (
                      <Card key={job.job_id}>
                        <CardHeader>
                          <CardTitle>{job.title}</CardTitle>
                          <CardDescription>
                            Application Status:{" "}
                            {job.bid_status && job.bid_status.toUpperCase()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>
                            <strong>Budget:</strong> {job.budget}
                          </p>
                          <p>
                            <strong>Deadline:</strong>{" "}
                            {job.deadline.toLocaleDateString()}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            onClick={() => handleViewJob(job)}
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center mt-6">
                    <p>No applied jobs found.</p>
                  </div>
                )}
              </TabsContent>
            )}
            <TabsContent value="posted">
              <div className="grid gap-6 mt-6">
                {postedJobs &&
                  postedJobs.map((job) => (
                    <Card key={job.job_id}>
                      <CardHeader>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          Status:{" "}
                          <Badge
                            variant={
                              job.job_status === "Open"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {job.job_status.toUpperCase()}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          <strong>Budget:</strong> {job.budget}
                        </p>
                        <p>
                          <strong>Deadline:</strong>{" "}
                          {job.deadline.toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Applicants:</strong> {job.bids.length}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          onClick={() => handleManageJob(job)}
                        >
                          Manage Job
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>Job Details</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2">
            <p>
              <strong>Description:</strong> {selectedJob?.description}
            </p>
            <p>
              <strong>Budget:</strong> {selectedJob?.budget}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {selectedJob?.deadline.toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedJob?.bid_status ? selectedJob?.bid_status : "Pending"}
            </p>
            <p>
              <strong>Your Bid Amount:</strong> {selectedJob?.bid_amount}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Job Modal */}
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>Manage Job Bids</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p>
              <strong>Description:</strong> {selectedJob?.description}
            </p>
            <p>
              <strong>Budget:</strong> {selectedJob?.budget}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {selectedJob?.deadline.toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedJob?.status}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bidder</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedJob?.bids?.map((bid: Bid) => (
                <TableRow key={bid.bid_id}>
                  <TableCell>{bid?.freelancer_name}</TableCell>
                  <TableCell>{bid?.bid_amount}</TableCell>
                  <TableCell>{bid?.status?.toUpperCase()}</TableCell>
                  <TableCell>
                    {bid?.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => acceptMutation.mutate(bid.bid_id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectMutation.mutate(bid.bid_id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
