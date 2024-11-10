<template>
  <div class="card flex justify-center">
    <Toast />
    <Form :resolver @submit="onFormSubmit">
      <FormField v-slot="$field" name="username" initialValue="">
        <IftaLabel>
          <InputText type="text" id="username" fluid />
          <label for="username">Username</label>
        </IftaLabel>
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
        </Message>
      </FormField>
      <FormField v-slot="$field" name="password" initialValue="">
        <IftaLabel>
          <Password inputId="password" :feedback="false" toggleMask fluid />
          <label for="password">Password</label>
        </IftaLabel>
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
        </Message>
      </FormField>
      <Button type="submit" severity="primary" label="Log in" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form } from '@primevue/forms';
import { FormField } from '@primevue/forms';
import Button from 'primevue/button';
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';
import Toast from 'primevue/toast';

import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';

import { client } from "../../api/index";

const emit = defineEmits(['close']);

const toast = useToast();

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
        console.log(res);
        toast.add({ severity: 'success', summary: 'Login successful.', life: 3000 });
      })
      .catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: `Login failed: ${err.message}.`, });
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

.p-formfield {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
