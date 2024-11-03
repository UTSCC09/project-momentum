<template>
  <div class="header-right">
    <SelectButton v-model="view" @change="switchView(view)" :options="views" aria-labelledby="basic" />

    <Avatar icon="pi pi-user" size="large" shape="circle" @click="toggle" aria-haspopup="true"
      aria-controls="overlay_menu" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

    <Dialog v-model:visible="visibleLogin" modal header="Log in" :style="{ width: '25rem' }">
      <div class="user-form-element">
        <label for="usernameLogin">Username</label>
        <InputText id="usernameLogin" autocomplete="off" v-model="usernameLogin" />
      </div>
      <div class="user-form-element">
        <label for="passwordLogin">Password</label>
        <Password inputId="passwordLogin" v-model="pwLogin" />
      </div>
      <div class="user-form-button-group">
        <Button type="button" label="Cancel" severity="secondary" @click="visibleLogin = false"></Button>
        <Button type="button" label="Submit" @click="visibleLogin = false"></Button>
      </div>
    </Dialog>

    <Dialog v-model:visible="visibleSignup" modal header="Sign up" :style="{ width: '25rem' }">
      <div class="user-form-element">
        <label for="emailSignup">Email</label>
        <InputText id="emailSignup" autocomplete="off" v-model="emailSignup" />
      </div>
      <div class="user-form-element">
        <label for="usernameSignup">Username</label>
        <InputText id="usernameSignup" autocomplete="off" v-model="usernameSignup" />
      </div>
      <div class="user-form-element">
        <label for="passwordSignup">Password</label>
        <Password inputId="passwordSignup" v-model="pwSignup" />
      </div>
      <div class="user-form-button-group">
        <Button type="button" label="Cancel" severity="secondary" @click="visibleSignup = false"></Button>
        <Button type="button" label="Submit" @click="signup"></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Password from "primevue/password";
import SelectButton from 'primevue/selectbutton';

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

const usernameLogin = ref(null);
const pwLogin = ref(null);
async function login() {
  const res = await client.users.loginUser.mutate({
    username: usernameLogin.value, password: pwLogin.value
  });
  console.log(res.user);
}

const emailSignup = ref(null);
const usernameSignup = ref(null);
const pwSignup = ref(null);
async function signup() {
  const res = await client.users.createUsers.mutate({
    username: usernameSignup.value,
    password: pwSignup.value,
    email: emailSignup.value,
  });
  console.log(res.user);
}

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
      {
        label: 'Apple',
        icon: 'pi pi-apple',
      }
    ]
  }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<style lang="css" scoped>
.user-form-element {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 4px;
}

.user-form-button-group {
  display: flex;
  justify-content: flex-end;
  gap: 2px;
  margin-top: 15px;
}

.header-right {
  display: flex;
  gap: var(--sx-spacing-padding4);
}

InputText {
  flex: 1 1 auto;
}
</style>