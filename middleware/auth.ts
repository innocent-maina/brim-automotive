// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo(`/auth/login?redirect=${to.path}`);
  }
  // Profile is loaded client-side in app.vue — middleware only checks session exists
});
