<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth.store.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

const authStore = useAuthStore();
if (authStore.user) router.push("/all");
</script>

<template>
  <RouterView />
</template>
