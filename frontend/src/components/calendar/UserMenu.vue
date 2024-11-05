<template>
  <div class="header-right">
    <SelectButton v-model="view" @change="switchView(view)" :options="views" aria-labelledby="basic" />

    <Avatar icon="pi pi-user" size="large" shape="circle" @click="toggle" aria-haspopup="true"
      aria-controls="overlay_menu" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

    <Dialog v-model:visible="visibleLogin" modal header="Log in" :style="{ width: '25rem' }">
      <div class="error-message">{{ msgLogin }}</div>
      <div class="user-form-element">
        <label for="usernameLogin">Username</label>
        <InputText id="usernameLogin" autocomplete="off" v-model="usernameLogin" />
      </div>
      <div class="user-form-element">
        <label for="passwordLogin">Password</label>
        <Password inputId="passwordLogin" v-model="pwLogin" :feedback="false" />
      </div>
      <div class="user-form-button-group">
        <Button type="button" label="Cancel" severity="secondary" @click="hideLoginDialog"></Button>
        <Button type="button" label="Submit" @click="login"></Button>
      </div>
    </Dialog>

    <Dialog v-model:visible="visibleSignup" modal header="Sign up" :style="{ width: '25rem' }">
      <div class="error-message">{{ msgSignup }}</div>
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
        <Button type="button" label="Cancel" severity="secondary" @click="hideSignupDialog"></Button>
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

const msgLogin = ref(null);
const msgSignup = ref(null);

const visibleLogin = ref(false);
const visibleSignup = ref(false);

const usernameLogin = ref(null);
const pwLogin = ref(null);
function login() {
  client.users.loginUser.mutate({
    username: usernameLogin.value, password: pwLogin.value
  })
  .then((res) => {
    hideLoginDialog();
  })
  .catch((err) => {
    msgLogin.value = err.message;
  });
}

const emailSignup = ref(null);
const usernameSignup = ref(null);
const pwSignup = ref(null);
function signup() {
  const res = client.users.createUser.mutate({
    username: usernameSignup.value,
    password: pwSignup.value,
    email: emailSignup.value,
  })
  .then((res) => {
    clearSignupDialog();
    msgSignup.value = "Success";
  })
  .catch((err) => {
    msgSignup.value = err.message;
  });
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

function clearLoginDialog() {
  usernameLogin.value = "";
  pwLogin.value = "";
  msgLogin.value = "";
}

function hideLoginDialog() {
  clearLoginDialog();
  visibleLogin.value = false;
}

function clearSignupDialog() {
  usernameSignup.value = "";
  emailSignup.value = "";
  pwSignup.value = "";
  msgSignup.value = "";
}

function hideSignupDialog() {
  clearSignupDialog();
  visibleSignup.value = false;
}
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

.error-message {
  color: var(--p-button-text-secondary-color);
  margin-bottom: 5px;
}
</style>