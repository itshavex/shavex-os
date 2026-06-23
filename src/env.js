// Environment variables runtime accessor
export const env = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID || "",
  GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_AUTH_CLIENT_ID || "",
};

export const hasSupabaseCreds = () => {
  return env.SUPABASE_URL && env.SUPABASE_ANON_KEY;
};
