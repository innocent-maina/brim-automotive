// server/api/inquiries/index.post.ts
import { useServerSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const body = await readBody(event);

  const { listing_id, name, phone, email, message } = body;

  if (!listing_id || !name || !message) {
    throw createError({
      statusCode: 400,
      message: "listing_id, name and message are required",
    });
  }

  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      listing_id,
      name,
      phone: phone ?? null,
      email: email ?? null,
      message,
    })
    .select()
    .single();

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data, error: null };
});
