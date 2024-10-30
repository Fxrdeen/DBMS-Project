export type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  rating: string;
  created_at: Date;
};

export type Job = {
  job_id: number;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  status: string;
  client_name: string;
  skills_required: string[] | null[];
};

export type Bid = {
  bid_id: number;
  freelancer_id: number;
  freelancer_name: string;
  bid_amount: number;
  status: string;
  created_at: Date;
};

export type UserWithSkills = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  rating: string;
  created_at: Date;
  skills: string[];
};

export type userBids = {
  job_id: number;
  title: string;
  description: string;
  job_status: string;
  budget: number;
  deadline: Date;
  bid_amount: number;
  bid_status: string;
};

export type JobBids = {
  job_id: number;
  title: string;
  description: string;
  deadline: Date;
  budget: number;
  job_status: string;
  bids: Bid[];
};

export type Feedback = {
  feedback_id: number;
  job_id: number;
  from_user_id: number;
  to_user_id: number;
};
