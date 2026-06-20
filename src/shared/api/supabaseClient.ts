import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
) as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const assertSupabaseConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error("Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env.");
  }
};

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "");
