// server/api/user/profile.get.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);

  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data, error: null };
});
