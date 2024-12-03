<template>
  <div class="header-right">
    <SelectButton v-model="view" @change="switchView(view)" :options="views" aria-labelledby="basic" />

    <Avatar icon="pi pi-user" size="large" shape="circle" @click="toggle" aria-haspopup="true"
      aria-controls="overlay_menu" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

    <Dialog v-model:visible="visibleLogin" modal header="Log in" :style="{ width: '25rem' }">
      <LoginForm @close="visibleLogin = false" />
    </Dialog>

    <Dialog v-model:visible="visibleSignup" modal header="Sign up" :style="{ width: '25rem' }">
      <SignupForm @close="visibleSignup = false" />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import Dialog from "primevue/dialog";
import SelectButton from "primevue/selectbutton";

import LoginForm from "../forms/LoginForm.vue";
import SignupForm from "../forms/SignupForm.vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store.ts";

import { client } from "../../api/index";

const authStore = useAuthStore();

const props = defineProps({
  view: {
    type: String,
    default: "Schedule",
  },
});

const visibleLogin = ref(false);
const visibleSignup = ref(false);

const router = useRouter();
const view = ref(props.view || "Schedule");
const views = ref(["Schedule", "Tasks"]);
function switchView(newView) {
  newView == "Tasks" ? router.push("/tasks") : router.push("/all");
}

const menu = ref();
const items = ref([
  {
    label: "Profile",
    items: authStore.user
      ? [
        {
          label: "Log out",
          icon: "pi pi-sign-out",
          command: () => {
            logout();
            authStore.logout();
            router.push("/");
          },
        },
      ]
      : [
        {
          label: "Log in",
          icon: "pi pi-sign-in",
          command: () => {
            visibleLogin.value = true;
          },
        },
        {
          label: "Sign up",
          icon: "pi pi-user-plus",
          command: () => {
            visibleSignup.value = true;
          },
        },
      ],
  },
  {
    label: "Integrate",
    items: [
      {
        label: "Google",
        icon: "pi pi-google",
        command: integrateGoogle,
      },
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

function integrateGoogle() {
  fetch("https://momentum-app.ca/api/api/oauth/google/calendar", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      toast.add({
        severity: "success",
        summary: `Retrieved events from Google.`,
        life: 3000,
      });
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: `Failed to retrieve events from Google.`,
        detail: err.message,
        life: 3000,
      });
    });
}

function logout() {
  client.users.logoutUser.mutate();
}
</script>

<style lang="css" scoped>
.header-right {
  display: flex;
  align-items: center;
  gap: var(--sx-spacing-padding4);
}
</style>
