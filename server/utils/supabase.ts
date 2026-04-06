// server/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS, used for all server operations
export const useServerSupabase = () => {
  const config = useRuntimeConfig();
  return createClient(
    "https://vjiqlwmdoirnsyhyssvg.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqaXFsd21kb2lybnN5aHlzc3ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQzNjk3MywiZXhwIjoyMDkxMDEyOTczfQ.V3qqN-boQwhMT5aC0igMgdwV_vq2Uy3RvxwEtmWE8_s",
    { auth: { persistSession: false } },
  );
};

// Get authenticated user by reading the Supabase access token from cookies.
// @nuxtjs/supabase stores the token in a cookie named sb-<ref>-auth-token
// We extract the JWT and verify it with the service role client.
export const getServerUser = async (event: any) => {
  try {
    // First try the #supabase/server approach
    const { serverSupabaseUser } = await import("#supabase/server");
    const user = await serverSupabaseUser(event);
    if (user?.id) return user;
  } catch {}

  // Fallback: manually parse the auth cookie and verify via getUser()
  try {
    const supabase = useServerSupabase();
    const cookies = parseCookies(event);

    // Find the Supabase auth cookie — it matches sb-*-auth-token
    const authCookieKey = Object.keys(cookies).find(
      (k) => k.startsWith("sb-") && k.endsWith("-auth-token"),
    );
    if (!authCookieKey) return null;

    let tokenData: any;
    try {
      tokenData = JSON.parse(decodeURIComponent(cookies[authCookieKey]));
    } catch {
      return null;
    }

    // The cookie value is [access_token, refresh_token] array or an object
    const accessToken = Array.isArray(tokenData)
      ? tokenData[0]
      : tokenData?.access_token;

    if (!accessToken) return null;

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) return null;
    return user;
  } catch {
    return null;
  }
};
