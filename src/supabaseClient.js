import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_DB_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY

// Create a single supabase client for interacting with your database
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)