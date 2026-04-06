// composables/useAuth.ts
// All profile data comes from /server/api routes.
// Cookies are forwarded via useRequestHeaders so SSR calls work correctly.
import type { Profile, UserRole } from "~/types";

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const profile = useState<Profile | null>("auth:profile", () => null);
  const profileLoading = useState<boolean>("auth:profileLoading", () => false);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => profile.value?.role === "admin");
  const isSeller = computed(
    () => !!user.value && profile.value?.role !== "guest",
  );

  const fetchProfile = async () => {
    if (!user.value) {
      profile.value = null;
      return;
    }
    profileLoading.value = true;
    try {
      // useRequestHeaders forwards cookies in SSR context automatically
      const headers = useRequestHeaders(["cookie"]);
      const res = await $fetch<{ data: Profile }>("/api/user/profile", {
        headers,
      });
      profile.value = res.data;
    } catch {
      profile.value = null;
    } finally {
      profileLoading.value = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data.user && data.session) {
      // Set the session explicitly so the client uses the correct auth token
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      // Now query with the authenticated session — RLS will see the correct user
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (!profErr && prof) {
        profile.value = prof as Profile;
      }
    }

    return { session: data.session, profile: profile.value };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    profile.value = null;
    await navigateTo("/");
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${useRuntimeConfig().public.siteUrl}/auth/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const requireAuth = async (role?: UserRole) => {
    if (!user.value) {
      await navigateTo("/auth/login");
      return false;
    }
    if (role === "admin" && !isAdmin.value) {
      await navigateTo("/");
      return false;
    }
    return true;
  };

  return {
    user,
    profile,
    profileLoading,
    isAuthenticated,
    isAdmin,
    isSeller,
    fetchProfile,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    requireAuth,
  };
};
