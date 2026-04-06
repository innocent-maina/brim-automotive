// server/api/user/saved/[id].delete.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  const listingId = getRouterParam(event, "id");
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const { error } = await supabase
    .from("saved_cars")
    .delete()
    .eq("user_id", user.id)
    .eq("listing_id", listingId);

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data: null, error: null };
});
