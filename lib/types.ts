// Central type definitions for the India Innovation Portal.

import type { Category, ChallengeStatus, ProjectStatus, Priority, State } from "./domain";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  category: Category;
  subcategory?: string | null;
  state?: string;         // e.g. "Jharkhand", "Punjab" — optional for backward compat; defaults to "Jharkhand"
  district: string;
  village_ward?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  submitter_name: string | null;
  submitter_id?: string | null;
  submitter_type?: "citizen" | "panchayat" | "ulb" | "community_org" | "government" | null;
  status: ChallengeStatus;
  priority?: Priority | null;
  priority_score?: number | null;
  assigned_university_id?: string | null;
  assigned_to?: string | null;
  photo_url?: string | null;
  video_url?: string | null;
  document_url?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type Problem = Challenge;

export type AIAnalysis = {
  id?: string;
  challenge_id: string;
  category: Category;
  subcategory: string;
  priority: Priority;
  priority_score: number;
  impact_score: number;
  urgency_score: number;
  duplicate_score: number;
  similar_challenge_id: string | null;
  problem_summary: string;
  affected_population: number;
  required_disciplines: string[];
  recommended_solution_types: string[];
  relevant_expertise?: string[];
  confidence_score: number;
  ai_provider: "gemini" | "fallback";
  created_at?: string;
};

export type Institution = {
  id?: string;
  name: string;
  state: State;
  district: string;
  domains: Category[];
  departments: string[];
  expertise: string[];
  facilities: string[];
  research_areas: string[];
  strengths?: Category[];
  disciplines?: string[];
  location?: string;
};

export type UniversityMatch = {
  name: string;
  university_name?: string;
  score: number;
  domain_score: number;
  discipline_score: number;
  capability_score: number;
  relevance_score: number;
  explanation: string;
  disciplines_matched: string[];
  state?: string;
  district?: string;
  matched_departments?: string[];
  matched_expertise?: string[];
  matched_facilities?: string[];
};

export type Solution = {
  id: string;
  title: string;
  problem_solved: string;
  domain: Category;
  state: string;
  district: string;
  institution: string;
  technology: string;
  project_stage: string;
  deployment_status: string;
  impact: string;
  project_timeline?: string;
  created_at: string;
};

export type Project = {
  id: string;
  challenge_id: string;
  title: string;
  description: string;
  university_id: string | null;
  university_name: string;
  faculty_lead?: string | null;
  industry_partner: string | null;
  status: ProjectStatus;
  progress: number;
  trl_level?: number | null; // Technology Readiness Level 1-9
  incubation_center?: string | null;
  start_date: string | null;
  target_date: string | null;
  created_at: string;
  updated_at: string | null;
};

export type ProjectMember = {
  id?: string;
  project_id: string;
  name: string;
  role: "faculty" | "student" | "mentor" | "industry" | "government";
  department?: string | null;
  organisation: string | null;
  created_at?: string;
};

export type ProposalStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected";

export type ProjectProposal = {
  id: string;
  project_id: string;
  problem_statement: string;
  proposed_solution: string;
  technology: string;
  implementation_plan: string;
  expected_cost: number | null;
  expected_impact: string;
  scalability: string;
  sustainability: string;
  status: ProposalStatus;
  document_url?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type Milestone = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  status: "pending" | "in_progress" | "completed" | "delayed";
  progress: number;
  completed_at: string | null;
  deliverable_url?: string | null;
  created_at: string;
};

export type IndustryParticipation = {
  id: string;
  project_id: string;
  industry_name: string;
  stakeholder_type?: "csr" | "msme" | "startup" | "psu" | "lab" | null;
  contribution_types: string[];
  description: string | null;
  funding_amount: number | null;
  status: "interested" | "active" | "completed";
  created_at: string;
};

export type Notification = {
  id: string;
  user_name: string;
  user_role: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "action";
  entity_type: string | null;
  entity_id: string | null;
  is_read: boolean;
  created_at: string;
};

export type Feedback = {
  id?: string;
  challenge_id: string;
  project_id: string | null;
  submitter_name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  created_at?: string;
};

export type ImpactMetric = {
  id?: string;
  project_id: string;
  people_impacted: number;
  cost_saved: number | null;
  water_saved: number | null;
  waste_reduced: number | null;
  jobs_created: number | null;
  satisfaction_score: number | null;
  notes: string | null;
  created_at?: string;
};

export type PatentRecord = {
  id: string;
  project_id: string;
  title: string;
  patent_number: string;
  filing_date: string;
  status: "provisional_filed" | "published" | "granted" | "open_source";
  inventors: string[];
  abstract?: string | null;
  document_url?: string | null;
  created_at: string;
};

export type StartupIncubation = {
  id: string;
  project_id: string;
  startup_name: string;
  incubation_center: string;
  dpiit_number?: string | null;
  funding_received?: number | null;
  founders: string[];
  status: "ideation" | "incubated" | "seed_funded" | "commercialized";
  created_at: string;
};

export type ProjectDiscussion = {
  id: string;
  project_id: string;
  author_name: string;
  author_role: "faculty" | "student" | "mentor" | "industry" | "government";
  message: string;
  message_type: "update" | "guidance" | "query" | "inspection";
  created_at: string;
};
