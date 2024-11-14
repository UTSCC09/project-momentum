<template>
  <div class="background">
    <div>
      <Sphere />
    </div>
    <div>
      <p>build your</p>
      <p><span style="color: white; font-size: 6rem;">momentum</span></p>
      <Button label="Get started" severity="secondary" @click="visibleSignup = true;" />
      <Button label="I already have an account" severity="primary" variant="text" class="custom" @click="visibleLogin = true;" />
    </div>
  </div>

  <Dialog v-model:visible="visibleLogin" modal header="Log in" :style="{ width: '25rem' }">
    <LoginForm @close="redirect" />
  </Dialog>

  <Dialog v-model:visible="visibleSignup" modal header="Sign up" :style="{ width: '25rem' }">
    <SignupForm @close="visibleSignup = false;" />
  </Dialog>
</template>

<script setup lang="ts">
import SignupForm from "./forms/SignupForm.vue"
import LoginForm from "./forms/LoginForm.vue";
import Sphere from "./Sphere.vue";
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

import { ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const visibleLogin = ref(false);
const visibleSignup = ref(false);

function redirect() {
  visibleLogin.value = false;
  router.push("/all");
}
</script>

<style lang="css" scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  background-color: #1d1e21;
}

p {
  color: slategray;
  font-size: 5rem;
  font-weight: 900;
  margin: -30px 0;
}

.p-button {
  margin-top: 30px;
  margin-left: 0;
}

.p-button.custom {
  --p-button-text-primary-hover-background: transparent;
  --p-button-text-primary-active-background: transparent;
  --p-button-text-primary-color: white;
}
</style>