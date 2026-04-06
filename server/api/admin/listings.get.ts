// server/api/admin/listings.get.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin")
    throw createError({ statusCode: 403, message: "Forbidden" });

  const query = getQuery(event);
  const status = query.status as string | undefined;

  let q = supabase
    .from("car_listings")
    .select(
      `*, car_images ( id, url, is_primary ), profiles ( id, full_name, phone )`,
    )
    .order("created_at", { ascending: false });

  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) throw createError({ statusCode: 500, message: error.message });

  const listings = (data ?? []).map((l: any) => {
    const images = l.car_images ?? [];
    const primary = images.find((i: any) => i.is_primary) ?? images[0];
    return { ...l, primary_image: primary?.url ?? null };
  });

  return { data: listings, error: null };
});
