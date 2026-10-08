import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Browser-side Supabase client (safe: anon key + URL only). Used for uploading
// evidence photos directly to Supabase Storage from the submit form.

let cached: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  if (!cached) cached = createClient(url, anon);
  return cached;
}

export const EVIDENCE_BUCKET = "evidence";
