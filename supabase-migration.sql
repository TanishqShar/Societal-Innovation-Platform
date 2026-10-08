-- Jharkhand Societal Innovation Portal - Migration Script
-- Run this in Supabase SQL Editor to add new tables and extend schema

-- 1. Extend problems table
alter table problems 
  add column if not exists subcategory text,
  add column if not exists village_ward text,
  add column if not exists priority text,
  add column if not exists priority_score integer,
  add column if not exists updated_at timestamptz;

-- 2. Projects table
create table if not exists projects (
  id text primary key,
  challenge_id text references problems(id) on delete set null,
  title text not null,
  description text not null,
  university_name text not null,
  university_id text,
  industry_partner text,
  status text not null default 'planning',
  progress integer not null default 0,
  start_date timestamptz default now(),
  target_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

alter table projects enable row level security;
create policy "public read projects" on projects for select using (true);
create policy "public insert projects" on projects for insert with check (true);
create policy "public update projects" on projects for update using (true);

-- 3. Milestones table
create table if not exists milestones (
  id text primary key,
  project_id text references projects(id) on delete cascade,
  title text not null,
  description text,
  deadline timestamptz,
  status text not null default 'pending',
  progress integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table milestones enable row level security;
create policy "public read milestones" on milestones for select using (true);
create policy "public insert milestones" on milestones for insert with check (true);
create policy "public update milestones" on milestones for update using (true);

-- 4. Industry Participation table
create table if not exists industry_participation (
  id text primary key,
  project_id text references projects(id) on delete cascade,
  industry_name text not null,
  contribution_types text[] not null default '{}',
  description text,
  funding_amount numeric,
  status text not null default 'interested',
  created_at timestamptz not null default now()
);

alter table industry_participation enable row level security;
create policy "public read industry_participation" on industry_participation for select using (true);
create policy "public insert industry_participation" on industry_participation for insert with check (true);
create policy "public update industry_participation" on industry_participation for update using (true);

-- 5. Notifications table
create table if not exists notifications (
  id text primary key,
  user_name text not null,
  user_role text,
  title text not null,
  message text not null,
  type text not null default 'info',
  is_read boolean not null default false,
  entity_type text,
  entity_id text,
  created_at timestamptz not null default now()
);

alter table notifications enable row level security;
create policy "public read notifications" on notifications for select using (true);
create policy "public insert notifications" on notifications for insert with check (true);
create policy "public update notifications" on notifications for update using (true);

-- 6. AI Analysis table
create table if not exists challenge_ai_analysis (
  challenge_id text primary key,
  priority text not null,
  priority_score integer not null,
  confidence numeric not null,
  subcategory text not null,
  duplicate_score numeric not null default 0,
  duplicate_of text,
  required_disciplines text[] not null default '{}',
  recommended_solution_types text[] not null default '{}',
  estimated_timeline_months integer not null default 3,
  summary text not null,
  ai_provider text not null default 'rule_fallback',
  created_at timestamptz not null default now()
);

alter table challenge_ai_analysis enable row level security;
create policy "public read challenge_ai_analysis" on challenge_ai_analysis for select using (true);
create policy "public insert challenge_ai_analysis" on challenge_ai_analysis for insert with check (true);
create policy "public update challenge_ai_analysis" on challenge_ai_analysis for update using (true);

-- 7. Feedback table
create table if not exists feedback (
  id text primary key,
  challenge_id text references problems(id) on delete cascade,
  project_id text,
  submitter_name text not null default 'Anonymous',
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now()
);

alter table feedback enable row level security;
create policy "public read feedback" on feedback for select using (true);
create policy "public insert feedback" on feedback for insert with check (true);

-- 8. Impact Metrics table
create table if not exists impact_metrics (
  id text primary key,
  project_id text references projects(id) on delete cascade,
  people_impacted integer not null default 0,
  cost_saved numeric,
  water_saved numeric,
  waste_reduced numeric,
  jobs_created integer,
  satisfaction_score numeric,
  notes text,
  recorded_at timestamptz not null default now()
);

alter table impact_metrics enable row level security;
create policy "public read impact_metrics" on impact_metrics for select using (true);
create policy "public insert impact_metrics" on impact_metrics for insert with check (true);

-- 9. Project Members table
create table if not exists project_members (
  id text primary key,
  project_id text references projects(id) on delete cascade,
  name text not null,
  role text not null default 'student_researcher',
  department text not null,
  skills text[] not null default '{}',
  joined_at timestamptz not null default now()
);

alter table project_members enable row level security;
create policy "public read project_members" on project_members for select using (true);
create policy "public insert project_members" on project_members for insert with check (true);
create policy "public update project_members" on project_members for update using (true);
create policy "public delete project_members" on project_members for delete using (true);

-- 10. Project Proposals table
create table if not exists project_proposals (
  id text primary key,
  project_id text references projects(id) on delete cascade,
  title text not null,
  problem_statement text not null,
  proposed_solution text not null,
  technology text not null,
  budget numeric not null default 0,
  timeline_months integer not null default 6,
  expected_impact text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table project_proposals enable row level security;
create policy "public read project_proposals" on project_proposals for select using (true);
create policy "public insert project_proposals" on project_proposals for insert with check (true);
create policy "public update project_proposals" on project_proposals for update using (true);

-- 11. Storage Bucket for field photos & evidence
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', true)
on conflict (id) do nothing;

create policy "evidence public read"
  on storage.objects for select
  using (bucket_id = 'evidence');

create policy "evidence public insert"
  on storage.objects for insert
  with check (bucket_id = 'evidence');
