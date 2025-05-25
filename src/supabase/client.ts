import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and Key from environment variables
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  let errorMessage = 'Supabase URL and Key are required. ';
  if (!supabaseUrl) errorMessage += 'PUBLIC_SUPABASE_URL is missing. ';
  if (!supabaseKey) errorMessage += 'PUBLIC_SUPABASE_ANON_KEY is missing. ';
  errorMessage += 'Please ensure they are set in your .env file.';
  throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseKey);