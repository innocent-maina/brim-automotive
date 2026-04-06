// server/api/articles/[slug].get.ts
import { useServerSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const slug = getRouterParam(event, "slug");

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data)
    throw createError({ statusCode: 404, message: "Article not found" });

  return { data, error: null };
});
