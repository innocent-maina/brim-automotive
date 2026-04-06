<!-- pages/dashboard/profile.vue -->
<template>
  <div class="space-y-6 max-w-lg">
    <div>
      <h1 class="font-display text-2xl text-ink">Profile</h1>
      <p class="font-body text-sm text-ink-muted mt-0.5">
        Update your account information.
      </p>
    </div>

    <div
      class="bg-surface rounded-lg border border-surface-3 shadow-card p-6 space-y-5"
    >
      <div>
        <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
          >Full Name</label
        >
        <UInput
          v-model="form.full_name"
          placeholder="Your full name"
          class="font-body"
        />
      </div>
      <div>
        <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
          >Phone Number</label
        >
        <UInput
          v-model="form.phone"
          placeholder="+254 7XX XXX XXX"
          type="tel"
          class="font-body"
        />
      </div>
      <div>
        <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
          >Email</label
        >
        <UInput
          :model-value="user?.email ?? ''"
          disabled
          class="font-body opacity-60"
        />
        <p class="text-xs font-body text-ink-faint mt-1">
          Email cannot be changed here.
        </p>
      </div>

      <UAlert
        v-if="success"
        color="success"
        variant="soft"
        title="Profile updated."
        icon="i-heroicons-check-circle"
      />
      <UAlert v-if="error" color="error" variant="soft" :title="error" />

      <UButton
        :loading="saving"
        class="font-body font-400"
        style="background-color: var(--color-brand); color: white"
        @click="save"
      >
        Save Changes
      </UButton>
    </div>

    <!-- Change password -->
    <div
      class="bg-surface rounded-lg border border-surface-3 shadow-card p-6 space-y-4"
    >
      <h2 class="font-display text-base text-ink">Change Password</h2>
      <div>
        <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
          >New Password</label
        >
        <UInput
          v-model="newPassword"
          type="password"
          placeholder="Minimum 8 characters"
          class="font-body"
        />
      </div>
      <UAlert
        v-if="pwSuccess"
        color="success"
        variant="soft"
        title="Password updated."
      />
      <UAlert v-if="pwError" color="error" variant="soft" :title="pwError" />
      <UButton
        variant="outline"
        :loading="pwSaving"
        class="font-body"
        @click="changePassword"
      >
        Update Password
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
useSeo({ title: "Profile", noIndex: true });

const { user, profile, updatePassword } = useAuth();

const form = reactive({
  full_name: profile.value?.full_name ?? "",
  phone: profile.value?.phone ?? "",
});

watch(profile, (p) => {
  if (p) {
    form.full_name = p.full_name ?? "";
    form.phone = p.phone ?? "";
  }
});

const saving = ref(false);
const success = ref(false);
const error = ref("");

const save = async () => {
  saving.value = true;
  success.value = false;
  error.value = "";
  try {
    await $fetch("/api/user/profile", { method: "PATCH", body: form });
    success.value = true;
  } catch (e: any) {
    error.value = e?.data?.message ?? "Update failed.";
  } finally {
    saving.value = false;
  }
};

const newPassword = ref("");
const pwSaving = ref(false);
const pwSuccess = ref(false);
const pwError = ref("");

const changePassword = async () => {
  if (newPassword.value.length < 8) {
    pwError.value = "Password must be at least 8 characters.";
    return;
  }
  pwSaving.value = true;
  pwSuccess.value = false;
  pwError.value = "";
  try {
    await updatePassword(newPassword.value);
    pwSuccess.value = true;
    newPassword.value = "";
  } catch (e: any) {
    pwError.value = e?.message ?? "Failed to update password.";
  } finally {
    pwSaving.value = false;
  }
};
</script>
