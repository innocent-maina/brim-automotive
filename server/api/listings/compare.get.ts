// server/api/listings/compare.get.ts
import { useServerSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const query = getQuery(event);
  const ids = ((query.ids as string) ?? "")
    .split(",")
    .filter(Boolean)
    .slice(0, 3);

  if (ids.length < 2) {
    throw createError({
      statusCode: 400,
      message: "Need at least 2 ids to compare",
    });
  }

  const { data, error } = await supabase
    .from("car_listings")
    .select(`*, car_images ( id, url, is_primary, sort_order )`)
    .in("id", ids)
    .eq("status", "active");

  if (error) throw createError({ statusCode: 500, message: error.message });

  const listings = (data ?? []).map((l: any) => {
    const images = l.car_images ?? [];
    const primary = images.find((i: any) => i.is_primary) ?? images[0];
    return { ...l, primary_image: primary?.url ?? null };
  });

  return { data: listings, error: null };
});
