<template>
  <div class="header-right">
    <SelectButton v-model="view" @change="switchView(view)" :options="views" aria-labelledby="basic" />

    <Avatar icon="pi pi-user" size="large" shape="circle" @click="toggle" aria-haspopup="true"
      aria-controls="overlay_menu" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

    <Dialog v-model:visible="visibleLogin" modal header="Log in" :style="{ width: '25rem' }">
      <LoginForm @close="visibleLogin = false;" />
    </Dialog>

    <Dialog v-model:visible="visibleSignup" modal header="Sign up" :style="{ width: '25rem' }">
      <SignupForm @close="visibleSignup = false;" />
    </Dialog>
  </div>
</template>

<script setup>
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import Dialog from 'primevue/dialog';
import SelectButton from 'primevue/selectbutton';

import LoginForm from '../forms/LoginForm.vue';
import SignupForm from '../forms/SignupForm.vue';

import { ref } from "vue";
import { useRouter } from 'vue-router';

import { client } from "../../api/index";

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
const views = ref(['Schedule', 'Tasks']);
function switchView(newView) {
  newView == 'Tasks' ? router.push("/tasks") : router.push("/");
}

const menu = ref();
const items = ref([
  {
    label: 'Profile',
    items: [
      {
        label: 'Log in',
        icon: 'pi pi-sign-in',
        command: () => {
          visibleLogin.value = true;
        }
      },
      {
        label: 'Sign up',
        icon: 'pi pi-user-plus',
        command: () => {
          visibleSignup.value = true;
        }
      }
    ]
  },
  {
    label: 'Connect',
    items: [
      {
        label: 'Google',
        icon: 'pi pi-google',
      },
      {
        label: 'Microsoft',
        icon: 'pi pi-microsoft',
      },
    ]
  }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<style lang="css" scoped>
.header-right {
  display: flex;
  align-items: center;
  gap: var(--sx-spacing-padding4);
}
</style>
