import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseAnonKey !== "your-anon-public-key"
);

export function createClient() {
  if (!isSupabaseConfigured) {
    // Return an inert/safe mock browser client to allow smooth local/demo testing without throwing
    return null;
  }

  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
