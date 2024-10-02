"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bid, Job, User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createBid, getJobById, getJobs } from "@/server";
import { Loader2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
export default function JobDetailsPage({
  job,
  userDetails,
}: {
  job: Job;
  userDetails: User[];
}) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const { toast } = useToast();
  const [deletingBidId, setDeletingBidId] = useState<number | null>(null);
  const handleDeleteBid = (bidId: number) => {
    setDeletingBidId(bidId);
  };

  const confirmDeleteBid = () => {
    if (deletingBidId) {
      // Here you would typically send a delete request to your backend
      console.log(`Deleting bid ${deletingBidId}`);
      // For demonstration, we'll remove the bid from the local state
      setDeletingBidId(null);
    }
  };
  const mutation = useMutation({
    mutationFn: async () => {
      const result = await createBid(
        job.job_id,
        userDetails[0].user_id,
        Number(bidAmount)
      );
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bid submitted successfully",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: `Failed to submit bid`,
        variant: "destructive",
      });
    },
  });
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
    setIsBidModalOpen(false);
    window.location.reload();
  };
  const { data, isLoading } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const result = await getJobs();
      return result as Job[];
    },
  });
  const handleApplyClick = () => {
    if (userDetails[0].role === "client") {
      setIsAlertOpen(true);
    } else {
      setIsBidModalOpen(true);
    }
  };
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
            <Button className="w-full" onClick={handleApplyClick}>
              Apply for this Job
            </Button>
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
                      <TableCell>
                        {bid.freelancer_name === userDetails[0].name && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBid(bid.bid_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Action Not Allowed</AlertDialogTitle>
            <AlertDialogDescription>
              Applying to jobs is not available for clients. Only freelancers
              can apply for jobs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isBidModalOpen} onOpenChange={setIsBidModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Your Bid</DialogTitle>
            <DialogDescription>
              Please enter your bid amount for this job. Only numbers are
              allowed.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBidSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bid-amount" className="text-right">
                  Bid Amount ($)
                </Label>
                <Input
                  id="bid-amount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter your bid amount"
                  min="1"
                  step="1"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit Bid</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
