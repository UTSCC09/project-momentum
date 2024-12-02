<template>
  <div>
    <Toast />

    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
      <div>
        <IftaLabel>
          <InputText name="username" type="text" id="username" fluid />
          <label for="username">Username</label>
        </IftaLabel>
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
          $form.username.error?.message }}
        </Message>
      </div>
      <div>
        <IftaLabel>
          <Password name="password" inputId="password" :feedback="false" toggleMask fluid />
          <label for="password">Password</label>
        </IftaLabel>
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error?.message }}
        </Message>
      </div>
      <Button type="submit" severity="primary" label="Log in" />
    </Form>
    <Button class="google-oauth" icon="pi pi-google" variant="outlined" label="Log in with Google" @click="googleLogin"
      fluid />
  </div>
</template>

<script setup lang="ts">
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';
import Toast from 'primevue/toast';

import { reactive } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';

import { client } from "../../api/index";
import { useAuthStore } from "../../stores/auth.store.ts";

import { useRouter } from "vue-router";

const router = useRouter();

const emit = defineEmits(['close']);

const props = defineProps({
  initialValues: {
    type: Object as PropType<{
      username: string,
      password: string,
    }>,
    required: false,
  }
});

const initialValues = reactive(props.initialValues || {});

const toast = useToast();

const authStore = useAuthStore();

const resolver = zodResolver(
  z.object({
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z.string().min(1, { message: 'Password is required.' })
  })
);

const onFormSubmit = ({ values, valid, reset }) => {
  if (valid) {
    client.users.loginUser.mutate(values)
      .then((res) => {
        emit('close');
        reset();
        authStore.login(res.user.id);
        toast.add({ severity: 'success', summary: 'Login successful.', life: 3000 });
      })
      .catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: `Login failed: ${err.message}.`, life: 3000 });
      });
  }
};

function googleLogin() {
  fetch('http://localhost:3000/api/oauth/google/signin', {
    method: 'POST',
  })
    .then((response) => response.json())
    .then(data => { window.location.href = data.url });
}
</script>

<style lang="css" scoped>
.p-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.google-oauth {
  margin-top: 1rem;
}
</style>
