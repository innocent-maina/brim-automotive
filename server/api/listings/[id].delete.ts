// server/api/listings/[id].delete.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  const id = getRouterParam(event, "id");

  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  let q = supabase.from("car_listings").delete().eq("id", id);
  if (profile?.role !== "admin") q = q.eq("seller_id", user.id);

  const { error } = await q;
  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data: null, error: null };
});
