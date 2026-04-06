// composables/useSavedCars.ts
// All calls go through /server/api — cookies forwarded for SSR compatibility.
export const useSavedCars = () => {
  const user = useSupabaseUser();
  const savedIds = useState<string[]>("saved:ids", () => []);

  const isSaved = (listingId: string) => savedIds.value.includes(listingId);

  const fetchSavedIds = async () => {
    if (!user.value) return;
    try {
      const headers = useRequestHeaders(["cookie"]);
      const res = await $fetch<{ data: string[] }>("/api/user/saved-ids", {
        headers,
      });
      if (res.data) savedIds.value = res.data;
    } catch {}
  };

  const toggleSaved = async (listingId: string) => {
    if (!user.value) {
      await navigateTo("/auth/login");
      return;
    }
    const headers = useRequestHeaders(["cookie"]);
    if (isSaved(listingId)) {
      savedIds.value = savedIds.value.filter((id) => id !== listingId);
      await $fetch(`/api/user/saved/${listingId}`, {
        method: "DELETE",
        headers,
      });
    } else {
      savedIds.value = [...savedIds.value, listingId];
      await $fetch("/api/user/saved", {
        method: "POST",
        body: { listing_id: listingId },
        headers,
      });
    }
  };

  return { savedIds, isSaved, fetchSavedIds, toggleSaved };
};
