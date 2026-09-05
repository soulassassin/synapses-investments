import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseAnonKey !== "your-anon-public-key"
);

let browserClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || typeof window === "undefined") {
    return null;
  }

  if (!browserClient) {
    try {
      browserClient = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
    } catch (e) {
      console.warn("Could not create Supabase client:", e);
      return null;
    }
  }

  return browserClient;
}
