export type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  rating: number;
  created_at: string;
};

export type Job = {
  job_id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  client_name: string;
  skills_required: string[] | null[];
};
