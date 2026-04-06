// server/api/listings/index.get.ts
import { useServerSupabase } from "~/server/utils/supabase";
import type { ListingFilters } from "~/types";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const query = getQuery(event) as Record<string, string>;

  let q = supabase
    .from("car_listings")
    .select(
      `
      *,
      car_images ( id, url, is_primary, sort_order )
    `,
    )
    .eq("status", "active");

  // Filters
  if (query.make) q = q.ilike("make", `%${query.make}%`);
  if (query.model) q = q.ilike("model", `%${query.model}%`);
  if (query.transmission) q = q.eq("transmission", query.transmission);
  if (query.fuel_type) q = q.eq("fuel_type", query.fuel_type);
  if (query.market_score) q = q.eq("market_score", query.market_score);
  if (query.body_type) q = q.ilike("body_type", `%${query.body_type}%`);
  if (query.year_min) q = q.gte("year", parseInt(query.year_min));
  if (query.year_max) q = q.lte("year", parseInt(query.year_max));
  if (query.price_min) q = q.gte("price", parseInt(query.price_min));
  if (query.price_max) q = q.lte("price", parseInt(query.price_max));
  if (query.mileage_max) q = q.lte("mileage", parseInt(query.mileage_max));

  // Full-text search across title, make, model
  if (query.search) {
    const s = query.search.trim();
    q = q.or(
      `title.ilike.%${s}%,make.ilike.%${s}%,model.ilike.%${s}%,color.ilike.%${s}%`,
    );
  }

  // Sort
  switch (query.sort) {
    case "price_asc":
      q = q.order("price", { ascending: true });
      break;
    case "price_desc":
      q = q.order("price", { ascending: false });
      break;
    case "oldest":
      q = q.order("created_at", { ascending: true });
      break;
    case "mileage_asc":
      q = q.order("mileage", { ascending: true });
      break;
    default:
      q = q
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
  }

  // Pagination
  const page = parseInt(query.page ?? "1");
  const limit = parseInt(query.limit ?? "12");
  const from = (page - 1) * limit;
  q = q.range(from, from + limit - 1);

  const { data, error, count } = await q;

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  // Flatten primary image to top-level
  const listings = (data ?? []).map((l: any) => {
    const images: any[] = l.car_images ?? [];
    const primary = images.find((i: any) => i.is_primary) ?? images[0];
    return { ...l, primary_image: primary?.url ?? null };
  });

  return { data: listings, error: null, total: count };
});
