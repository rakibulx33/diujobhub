export type Job = {
  id: string;
  title: string;
  company: string;
  logo: string;
  logoBg: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  posted: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  applicants: number;
  remote: boolean;
  status?: string;
};

export type Application = {
  id: string;
  user_id: string;
  job_id: string;
  status: string;
  applied_at: string;
  stage: number;
  title?: string;
  company?: string;
  logo?: string;
  logoBg?: string;
  location?: string;
  type?: string;
  salary?: string;
};

export type Candidate = {
  id: string;
  user_id: string;
  job_id: string;
  name: string;
  role: string;
  matchScore: number;
  applied: string;
  stage: string;
  skills: string[];
};
