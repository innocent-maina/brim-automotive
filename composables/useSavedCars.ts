// composables/useSavedCars.ts
export const useSavedCars = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const savedIds = useState<string[]>("saved:ids", () => []);

  const isSaved = (listingId: string) => savedIds.value.includes(listingId);

  const fetchSavedIds = async () => {
    if (!user.value?.id) return;
    try {
      const { data } = await supabase
        .from("saved_cars")
        .select("listing_id")
        .eq("user_id", user.value.id);
      if (data) savedIds.value = data.map((r: any) => r.listing_id);
    } catch {}
  };

  const toggleSaved = async (listingId: string) => {
    if (!user.value?.id) {
      await navigateTo("/auth/login");
      return;
    }
    if (isSaved(listingId)) {
      savedIds.value = savedIds.value.filter((id) => id !== listingId);
      await supabase
        .from("saved_cars")
        .delete()
        .eq("user_id", user.value.id)
        .eq("listing_id", listingId);
    } else {
      savedIds.value = [...savedIds.value, listingId];
      await supabase
        .from("saved_cars")
        .insert({ user_id: user.value.id, listing_id: listingId });
    }
  };

  return { savedIds, isSaved, fetchSavedIds, toggleSaved };
};
