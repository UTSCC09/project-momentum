<template>
  <div>
    <Toast />

    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
      <div>
        <IftaLabel>
          <InputText name="email" id="email" type="text" auto fluid />
          <label for="email">Email</label>
        </IftaLabel>
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message }}
        </Message>
      </div>
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
          <Password name="password" inputId="password" toggleMask fluid />
          <label for="password">Password</label>
        </IftaLabel>
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error?.message }}
        </Message>
      </div>
      <Button type="submit" severity="primary" label="Sign up" />
    </Form>
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

const emit = defineEmits(['close']);

const props = defineProps({
  initialValues: {
    type: Object as PropType<{
      email: string,
      username: string,
      password: string,
    }>,
    required: false,
  }
});

const initialValues = reactive(props.initialValues || {});

const toast = useToast();

const resolver = zodResolver(
  z.object({
    email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Email is invalid.' }),
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z.string().min(1, { message: 'Password is required.' })
  })
);

const onFormSubmit = ({ values, valid, reset }) => {
  if (valid) {
    client.users.createUser.mutate(values)
      .then((res) => {
        emit('close');
        reset();
        toast.add({ severity: 'success', summary: 'Signup completed.', life: 3000 });
      })
      .catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: `Signup failed: ${err.message}.`, life: 3000 });
      });
  }
};
</script>

<style lang="css" scoped>
.p-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
</style>