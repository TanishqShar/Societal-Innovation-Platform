-- Run this in Supabase → SQL Editor → New query → Run.
-- Creates the `problems` table used by the portal.

create table if not exists problems (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null,
  category text not null,
  district text not null,
  village_ward text,
  submitter_name text,
  status text not null default 'submitted',
  assigned_to text,
  photo_url text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security, then allow the anon (public) key to read/write.
-- NOTE: this is intentionally open for a hackathon demo. For production you
-- would restrict writes to authenticated users.
alter table problems enable row level security;

create policy "public read"   on problems for select using (true);
create policy "public insert" on problems for insert with check (true);
create policy "public update" on problems for update using (true);

-- Optional: a few starter rows so the demo isn't empty.
insert into problems (title, description, category, district, submitter_name, status, assigned_to) values
('No safe drinking water in Namkum village', 'The only borewell has run dry and families walk 2 km for water. The pond water is contaminated.', 'Water Resources', 'Ranchi', 'Sunita Devi', 'Assigned', 'Birsa Agricultural University'),
('Government school has no functional toilets', 'The primary school toilets are broken, so many girl students have stopped attending classes.', 'Sanitation', 'Hazaribagh', 'Village Education Committee', 'Under Review', null),
('Frequent power cuts damaging farm irrigation pumps', 'Load shedding of 8+ hours a day means farmers cannot run electric pumps for paddy irrigation.', 'Energy', 'Palamu', 'Ramesh Oraon', 'Submitted', null);
