// server/api/user/inquiries.get.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { data, error } = await supabase
    .from("inquiries")
    .select(
      `
      *,
      car_listings ( id, title, make, model, year )
    `,
    )
    .in(
      "listing_id",
      supabase.from("car_listings").select("id").eq("seller_id", user.id),
    )
    .order("created_at", { ascending: false });

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data: data ?? [], error: null };
});
