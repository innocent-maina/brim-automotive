// server/api/user/stats.get.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  // Fetch seller's listing IDs first
  const { data: listingRows } = await supabase
    .from("car_listings")
    .select("id, status")
    .eq("seller_id", user.id);

  const listings = listingRows ?? [];
  const listingIds = listings.map((l: any) => l.id);

  // Fetch inquiries only if there are listings to query against
  let inquiries: any[] = [];
  if (listingIds.length > 0) {
    const { data: inquiryRows } = await supabase
      .from("inquiries")
      .select("id, status")
      .in("listing_id", listingIds);
    inquiries = inquiryRows ?? [];
  }

  return {
    data: {
      total_listings: listings.length,
      active_listings: listings.filter((l: any) => l.status === "active")
        .length,
      pending_listings: listings.filter((l: any) => l.status === "pending")
        .length,
      sold_listings: listings.filter((l: any) => l.status === "sold").length,
      total_inquiries: inquiries.length,
      new_inquiries: inquiries.filter((i: any) => i.status === "new").length,
    },
    error: null,
  };
});
