// server/api/articles/index.get.ts
import { useServerSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();

  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, cover_url, created_at, updated_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data: data ?? [], error: null };
});
