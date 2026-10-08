-- India Societal Innovation Portal - Migration V2 (India-wide Architecture)
-- Run this in Supabase SQL Editor after supabase-migration.sql
-- Upgrades from Jharkhand-only to India State District Problem Institution

-- ============================================================
-- 1. States lookup table
-- ============================================================
create table if not exists states (
  id   text primary key,
  name text not null unique,
  code text,
  created_at timestamptz not null default now()
);

alter table states enable row level security;
create policy "public read states" on states for select using (true);

insert into states (id, name, code) values
  ('jharkhand',   'Jharkhand',   'JH'),
  ('punjab',      'Punjab',      'PB'),
  ('maharashtra', 'Maharashtra', 'MH'),
  ('karnataka',   'Karnataka',   'KA'),
  ('rajasthan',   'Rajasthan',   'RJ')
on conflict (id) do nothing;

-- ============================================================
-- 2. Extend problems table with state column
-- ============================================================
alter table problems
  add column if not exists state text not null default 'Jharkhand',
  add column if not exists submitter_id text,
  add column if not exists submitter_type text,
  add column if not exists video_url text,
  add column if not exists location_lat numeric,
  add column if not exists location_lng numeric,
  add column if not exists assigned_university_id text;

update problems set state = 'Jharkhand' where state is null or state = '';

create index if not exists problems_state_idx on problems(state);
create index if not exists problems_district_idx on problems(district);
create index if not exists problems_status_idx on problems(status);

-- ============================================================
-- 3. Institutions table
-- ============================================================
create table if not exists institutions (
  id          text primary key default gen_random_uuid()::text,
  name        text not null,
  type        text not null default 'university',
  state_id    text references states(id),
  location    text,
  strengths   text[] not null default '{}',
  disciplines text[] not null default '{}',
  is_demo     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table institutions enable row level security;
create policy "public read institutions" on institutions for select using (true);

-- Jharkhand institutions (real)
insert into institutions (name, type, state_id, location, strengths, disciplines, is_demo) values
  ('IIT (ISM) Dhanbad','university','jharkhand','Dhanbad',ARRAY['Energy','Environment','Water Resources','Urban Development'],ARRAY['Electrical Engineering','Environmental Engineering','Civil Engineering','Mining Engineering','IoT','Computer Science'],false),
  ('BIT Mesra, Ranchi','university','jharkhand','Ranchi',ARRAY['Energy','Urban Development','Accessibility','Education'],ARRAY['Mechanical Engineering','Rehabilitation Engineering','Computer Science','Electronics','Architecture'],false),
  ('Central University of Jharkhand','university','jharkhand','Ranchi',ARRAY['Environment','Rural Livelihoods','Public Administration'],ARRAY['Environmental Science','Economics','Public Policy','Social Work','Law'],false),
  ('Birsa Agricultural University','university','jharkhand','Ranchi',ARRAY['Agriculture','Rural Livelihoods','Water Resources'],ARRAY['Agronomy','Soil Science','Agricultural Engineering','Hydrology','Biotechnology'],false),
  ('RIMS Ranchi','university','jharkhand','Ranchi',ARRAY['Healthcare','Sanitation'],ARRAY['Medicine','Public Health','Epidemiology','Pharmacy','Microbiology'],false),
  ('Ranchi University','university','jharkhand','Ranchi',ARRAY['Education','Public Administration','Accessibility'],ARRAY['Education Technology','Social Work','Information Systems','Computer Science','Law'],false),
  ('BIT Sindri','university','jharkhand','Dhanbad',ARRAY['Water Resources','Energy','Urban Development','Environment'],ARRAY['Civil Engineering','Environmental Engineering','IoT','Electrical Engineering','Mechanical Engineering','Chemical Engineering','Computer Science'],false)
on conflict do nothing;

-- Demo institutions for other states
insert into institutions (name, type, state_id, location, strengths, disciplines, is_demo) values
  ('IIT Ropar','university','punjab','Rupnagar',ARRAY['Energy','Water Resources','Agriculture','Urban Development'],ARRAY['Civil Engineering','Electrical Engineering','Computer Science','Biomedical Engineering','Environmental Engineering'],true),
  ('Punjab Agricultural University','university','punjab','Ludhiana',ARRAY['Agriculture','Rural Livelihoods','Water Resources'],ARRAY['Agronomy','Soil Science','Agricultural Engineering','Biotechnology','Remote Sensing'],true),
  ('Guru Nanak Dev University','university','punjab','Amritsar',ARRAY['Education','Public Administration','Rural Livelihoods'],ARRAY['Education Technology','Social Work','Public Policy','Economics','Law'],true),
  ('Panjab University','university','punjab','Chandigarh',ARRAY['Healthcare','Sanitation','Environment'],ARRAY['Medicine','Public Health','Environmental Science','Chemistry','Pharmacy'],true),
  ('IIT Bombay','university','maharashtra','Mumbai',ARRAY['Urban Development','Energy','Environment','Accessibility'],ARRAY['Civil Engineering','Electrical Engineering','Computer Science','Urban Planning','IoT','GIS'],true),
  ('University of Pune (SPPU)','university','maharashtra','Pune',ARRAY['Education','Public Administration','Agriculture'],ARRAY['Education Technology','Public Policy','Agronomy','Social Work','Information Systems'],true),
  ('VNIT Nagpur','university','maharashtra','Nagpur',ARRAY['Water Resources','Urban Development','Energy'],ARRAY['Civil Engineering','Environmental Engineering','Electrical Engineering','Mechanical Engineering','Architecture'],true),
  ('AFMC Pune','university','maharashtra','Pune',ARRAY['Healthcare','Sanitation'],ARRAY['Medicine','Public Health','Epidemiology','Biomedical Engineering','Microbiology'],true),
  ('IISc Bengaluru','research_lab','karnataka','Bengaluru',ARRAY['Energy','Environment','Water Resources','Agriculture'],ARRAY['Environmental Science','Electrical Engineering','Biomedical Engineering','Chemistry','IoT','Remote Sensing'],true),
  ('NIT Karnataka (NITK)','university','karnataka','Mangaluru',ARRAY['Water Resources','Urban Development','Energy'],ARRAY['Civil Engineering','Environmental Engineering','Electrical Engineering','Computer Science','GIS'],true),
  ('UAS Bengaluru','university','karnataka','Bengaluru',ARRAY['Agriculture','Rural Livelihoods','Water Resources'],ARRAY['Agronomy','Soil Science','Agricultural Engineering','Biotechnology','Horticulture'],true),
  ('Rajiv Gandhi University of Health Sciences','university','karnataka','Bengaluru',ARRAY['Healthcare','Sanitation'],ARRAY['Medicine','Public Health','Pharmacy','Nursing','Epidemiology'],true),
  ('IIT Jodhpur','university','rajasthan','Jodhpur',ARRAY['Energy','Water Resources','Urban Development'],ARRAY['Electrical Engineering','Civil Engineering','Computer Science','Environmental Engineering','IoT'],true),
  ('MPUAT Udaipur','university','rajasthan','Udaipur',ARRAY['Agriculture','Rural Livelihoods','Water Resources'],ARRAY['Agronomy','Soil Science','Irrigation Engineering','Animal Science','Agricultural Economics'],true),
  ('Rajasthan University of Health Sciences','university','rajasthan','Jaipur',ARRAY['Healthcare','Sanitation'],ARRAY['Medicine','Public Health','Pharmacy','Nursing','Epidemiology'],true),
  ('Rajasthan Technical University','university','rajasthan','Kota',ARRAY['Energy','Urban Development','Education','Public Administration'],ARRAY['Electrical Engineering','Mechanical Engineering','Computer Science','Civil Engineering','Architecture'],true)
on conflict do nothing;

-- Permissions
grant select on states to anon;
grant select on institutions to anon;
