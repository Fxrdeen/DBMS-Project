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
