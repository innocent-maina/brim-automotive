// server/api/user/profile.patch.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const body = await readBody(event);
  const allowed = ["full_name", "phone", "avatar_url"];
  const update: Record<string, any> = {};
  allowed.forEach((k) => {
    if (body[k] !== undefined) update[k] = body[k];
  });

  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data, error: null };
});
