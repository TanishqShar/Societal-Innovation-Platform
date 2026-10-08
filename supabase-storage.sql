-- Run this in Supabase → SQL Editor → New query → Run.
-- Enables real photo/evidence uploads via Supabase Storage.

-- 1. Create a public bucket named "evidence".
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', true)
on conflict (id) do nothing;

-- 2. Allow the public (anon) key to upload to and read from that bucket.
--    Open for the hackathon demo; tighten to authenticated users in production.
create policy "evidence public read"
  on storage.objects for select
  using (bucket_id = 'evidence');

create policy "evidence public insert"
  on storage.objects for insert
  with check (bucket_id = 'evidence');
