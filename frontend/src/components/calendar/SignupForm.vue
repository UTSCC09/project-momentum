<template>
    <div class="card flex justify-center">
      <Toast />
      <Form :resolver @submit="onFormSubmit">
        <FormField v-slot="$field" name="email" initialValue="">
          <InputText type="text" placeholder="Email" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="username" initialValue="">
          <InputText type="text" placeholder="Username" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="password" initialValue="">
          <Password placeholder="Password" toggleMask fluid />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <Button type="submit" severity="primary" label="Sign up" />
      </Form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Form } from '@primevue/forms';
  import { FormField } from '@primevue/forms';
  import Button from 'primevue/button';
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
          console.log(res);
          toast.add({ severity: 'success', summary: 'Signup completed.', life: 3000 });
        })
        .catch((err) => {
          console.error(err);
          toast.add({ severity: 'error', summary: `Signup failed: ${err.message}.`, });
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
  