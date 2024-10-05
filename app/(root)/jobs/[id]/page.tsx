"use client";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBid,
  deleteBid,
  getJobById,
  getJobs,
  getUserDetails,
} from "@/server";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
const PageJob = () => {
  const { user } = useUser();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const result = await getJobs();
      return result as Job[];
    },
  });
  const { data: userDetails, isLoading: isLoadingUserDetails } = useQuery<
    User[]
  >({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const result = await getUserDetails(
        user?.emailAddresses[0].emailAddress!
      );
      return result as User[];
    },
    enabled: !!user?.emailAddresses[0].emailAddress,
  });
  const jobId = parseInt(id as string);
  const job = data?.find((j) => j.job_id === jobId);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [deletingBidId, setDeletingBidId] = useState<number | null>(null);
  const { data: bids, isLoading: isLoadingBids } = useQuery<Bid[]>({
    queryKey: ["bids"],
    queryFn: async () => {
      const result = await getJobById(jobId);
      return result as Bid[];
    },
    enabled: !!job,
  });
  const mutation = useMutation({
    mutationFn: async () => {
      const result = await createBid(
        job?.job_id!,
        userDetails?.[0].user_id!,
        Number(bidAmount)
      );
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bid submitted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: `Failed to submit bid`,
        variant: "destructive",
      });
    },
  });
  const delMutation = useMutation({
    mutationFn: async (bidId: number) => {
      const result = await deleteBid(bidId);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bid deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      setDeletingBidId(null);
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: `Failed to delete bid`,
        variant: "destructive",
      });
    },
  });
  const confirmDeleteBid = async () => {
    if (deletingBidId) {
      delMutation.mutate(deletingBidId);
      console.log(`Deleting bid ${deletingBidId}`);
      setDeletingBidId(null);
      router.refresh();
    }
  };
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
    setIsBidModalOpen(false);
    router.refresh();
  };
  const handleApplyClick = () => {
    if (userDetails?.[0].role === "client") {
      setIsAlertOpen(true);
    } else {
      setIsBidModalOpen(true);
    }
  };
  if (isLoading || isLoadingUserDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="container mx-auto">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">{job?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{job?.description}</p>
              <div>
                <h3 className="font-semibold mb-2">Required Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {job?.skills_required.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">Budget: {job?.budget}</p>
                <p className="text-sm text-muted-foreground">
                  Deadline: {job?.deadline.toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Posted by: {job?.client_name}
              </p>
            </CardContent>
            <CardFooter>
              {userDetails?.[0].name === job?.client_name ? (
                <Button className="w-full" onClick={handleApplyClick} disabled>
                  You can't apply to your own job
                </Button>
              ) : (
                <Button className="w-full" onClick={handleApplyClick}>
                  Apply for this Job
                </Button>
              )}
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
                          {bid.freelancer_name === userDetails?.[0].name && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeletingBidId(bid.bid_id);
                                console.log(deletingBidId);
                              }}
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
      <AlertDialog
        open={deletingBidId !== null}
        onOpenChange={() => setDeletingBidId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this bid?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              bid from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBid}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PageJob;
