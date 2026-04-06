// server/api/listings/[id].patch.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  const id = getRouterParam(event, "id");

  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const body = await readBody(event);

  // If price changes, recompute market score
  if (body.price || body.make || body.model || body.year) {
    const { data: listing } = await supabase
      .from("car_listings")
      .select("make, model, year, price")
      .eq("id", id)
      .single();

    if (listing) {
      const { data: scoreData } = await supabase.rpc("compute_market_score", {
        p_make: body.make ?? listing.make,
        p_model: body.model ?? listing.model,
        p_year: body.year ?? listing.year,
        p_price: body.price ?? listing.price,
      });
      body.market_score = scoreData ?? "fair_price";
    }
  }

  let q = supabase.from("car_listings").update(body).eq("id", id);

  // Non-admins can only edit their own listings
  if (profile?.role !== "admin") {
    q = q.eq("seller_id", user.id);
  }

  const { data, error } = await q.select().single();

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data, error: null };
});
