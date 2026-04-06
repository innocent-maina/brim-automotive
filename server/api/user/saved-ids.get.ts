// server/api/user/saved-ids.get.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { data, error } = await supabase
    .from("saved_cars")
    .select("listing_id")
    .eq("user_id", user.id);

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data: (data ?? []).map((r: any) => r.listing_id), error: null };
});
