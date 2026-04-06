<!-- pages/auth/register.vue -->
<template>
  <div class="w-full max-w-sm">
    <div
      v-if="!success"
      class="bg-surface rounded-xl border border-surface-3 shadow-card p-8"
    >
      <div class="text-center mb-7">
        <BrimLogo class="justify-center mb-4" />
        <h1 class="font-display text-2xl text-ink">Create Account</h1>
        <p class="font-body text-sm text-ink-muted mt-1">
          Start buying or selling cars
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
            >Full Name</label
          >
          <UInput
            v-model="fullName"
            placeholder="John Kamau"
            autocomplete="name"
            class="font-body"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
            >Email</label
          >
          <UInput
            v-model="email"
            type="email"
            placeholder="your@email.com"
            autocomplete="email"
            class="font-body"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
            >Password</label
          >
          <UInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Minimum 8 characters"
            autocomplete="new-password"
            class="font-body"
            required
            minlength="8"
          >
            <template #trailing>
              <button type="button" @click="showPassword = !showPassword">
                <UIcon
                  :name="
                    showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                  "
                  class="w-4 h-4 text-ink-faint hover:text-ink-soft"
                />
              </button>
            </template>
          </UInput>
        </div>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error"
          icon="i-heroicons-exclamation-circle"
        />

        <UButton
          type="submit"
          block
          :loading="loading"
          class="font-body font-400 mt-2"
          style="background-color: var(--color-brand); color: white"
        >
          Create Account
        </UButton>
      </form>

      <p
        class="text-center text-xs font-body text-ink-faint mt-4 leading-relaxed"
      >
        By creating an account you agree to our
        <NuxtLink to="/terms" class="text-brand hover:underline"
          >Terms</NuxtLink
        >
        and
        <NuxtLink to="/privacy" class="text-brand hover:underline"
          >Privacy Policy</NuxtLink
        >.
      </p>

      <p class="text-center text-sm font-body text-ink-muted mt-5">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-brand hover:underline"
          >Sign in</NuxtLink
        >
      </p>
    </div>

    <!-- Success state -->
    <div
      v-else
      class="bg-surface rounded-xl border border-surface-3 shadow-card p-8 text-center"
    >
      <UIcon
        name="i-heroicons-envelope"
        class="w-10 h-10 text-brand mx-auto mb-4"
      />
      <h2 class="font-display text-2xl text-ink">Check your email</h2>
      <p class="font-body text-sm text-ink-muted mt-2 leading-relaxed">
        We've sent a confirmation link to
        <strong class="text-ink">{{ email }}</strong
        >. Click it to activate your account.
      </p>
      <NuxtLink
        to="/auth/login"
        class="mt-5 inline-block font-body text-sm text-brand hover:underline"
      >
        Back to Sign In
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });
useSeo({ title: "Create Account", noIndex: true });

const { signUp } = useAuth();

const fullName = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");
const success = ref(false);

const handleRegister = async () => {
  loading.value = true;
  error.value = "";
  try {
    await signUp(email.value, password.value, fullName.value);
    success.value = true;
  } catch (e: any) {
    error.value = e?.message ?? "Registration failed. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
