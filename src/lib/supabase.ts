import { createClient } from '@supabase/supabase-js';

// Add debug logging
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    }
  }
); 