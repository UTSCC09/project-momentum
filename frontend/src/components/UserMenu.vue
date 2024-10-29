<template>
  <Avatar icon="pi pi-user" size="large" shape="circle" @click="toggle" aria-haspopup="true"
    aria-controls="overlay_menu" />
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

  <Dialog v-model:visible="visibleLogin" modal header="Log in" :style="{ width: '25rem' }">
    <div class="user-form-element">
      <label for="emailLogin">Email</label>
      <InputText id="emailLogin" autocomplete="off" />
    </div>
    <div class="user-form-element">
      <label for="passwordLogin">Password</label>
      <Password inputId="passwordLogin" v-model="pwLogin" />
    </div>
    <div class="user-form-button-group">
      <Button type="button" label="Cancel" severity="secondary" @click="visibleLogin = false"></Button>
      <Button type="button" label="Save" @click="visibleLogin = false"></Button>
    </div>
  </Dialog>

  <Dialog v-model:visible="visibleSignup" modal header="Sign up" :style="{ width: '25rem' }">
    <div class="user-form-element">
      <label for="emailSignup">Email</label>
      <InputText id="emailSignup" autocomplete="off" />
    </div>
    <div class="user-form-element">
      <label for="passwordSignup">Password</label>
      <Password inputId="passwordSignup" v-model="pwSignup" />
    </div>
    <div class="user-form-button-group">
      <Button type="button" label="Cancel" severity="secondary" @click="visibleSignup = false"></Button>
      <Button type="button" label="Save" @click="visibleSignup = false"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Password from "primevue/password";
import InputMask from 'primevue/inputmask';

import { ref } from "vue";

const visibleLogin = ref(false);
const visibleSignup = ref(false);
const pwLogin = ref(null);
const pwSignup = ref(null);
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

InputText {
  flex: 1 1 auto;
}
</style>