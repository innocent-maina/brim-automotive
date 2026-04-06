// server/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { serverSupabaseUser } from "#supabase/server";

// Service-role client — bypasses RLS entirely.
// Used for all server-side DB operations.
export const useServerSupabase = () => {
  const config = useRuntimeConfig();
  return createClient(
    "https://vjiqlwmdoirnsyhyssvg.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqaXFsd21kb2lybnN5aHlzc3ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQzNjk3MywiZXhwIjoyMDkxMDEyOTczfQ.V3qqN-boQwhMT5aC0igMgdwV_vq2Uy3RvxwEtmWE8_s",
    { auth: { persistSession: false } },
  );
};

// Read authenticated user from the request.
// Works for browser-initiated requests (button clicks, form submits)
// where the browser sends the Supabase auth cookie automatically.
// NOT reliable for $fetch calls during SSR — avoid those entirely.
export const getServerUser = async (event: any) => {
  try {
    const user = await serverSupabaseUser(event);
    if (user?.id) return user;
  } catch {}

  // Fallback: read JWT from Authorization header (sent by $fetch on client)
  try {
    const supabase = useServerSupabase();
    const authHeader = getRequestHeader(event, "authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return null;
    const {
      data: { user },
    } = await supabase.auth.getUser(token);
    if (user?.id) return user;
  } catch {}

  return null;
};
