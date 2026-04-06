// server/api/user/saved.post.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { listing_id } = await readBody(event);
  if (!listing_id)
    throw createError({ statusCode: 400, message: "Missing listing_id" });

  const { data, error } = await supabase
    .from("saved_cars")
    .insert({ user_id: user.id, listing_id })
    .select()
    .single();

  if (error && error.code !== "23505") {
    // ignore duplicate
    throw createError({ statusCode: 500, message: error.message });
  }

  return { data, error: null };
});
