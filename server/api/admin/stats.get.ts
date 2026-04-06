// server/api/admin/stats.get.ts
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

  const [listingsRes, inquiriesRes, usersRes] = await Promise.all([
    supabase.from("car_listings").select("id, status, price"),
    supabase.from("inquiries").select("id, status"),
    supabase.from("profiles").select("id, role"),
  ]);

  const listings = listingsRes.data ?? [];
  const inquiries = inquiriesRes.data ?? [];
  const users = usersRes.data ?? [];

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
      total_users: users.filter((u: any) => u.role === "user").length,
      total_revenue_est: listings
        .filter((l: any) => l.status === "sold")
        .reduce((sum: number, l: any) => sum + (l.price ?? 0), 0),
    },
    error: null,
  };
});
