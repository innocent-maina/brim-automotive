// middleware/admin.ts
export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();
  const { profile, fetchProfile } = useAuth();

  if (!user.value) {
    return navigateTo("/auth/login");
  }

  // Profile may not be loaded yet on hard navigation — fetch it
  if (!profile.value) {
    await fetchProfile();
  }

  if (profile.value?.role !== "admin") {
    return navigateTo("/");
  }
});
