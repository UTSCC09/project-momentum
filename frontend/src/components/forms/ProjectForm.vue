<template>
  <div>
    <Toast />
    <Form :resolver @submit="onFormSubmit">
      <FormField v-slot="$field" name="name" initialValue="">
        <IftaLabel>
          <InputText id="name" type="text" auto fluid />
          <label for="name">Name</label>
        </IftaLabel>
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
        </Message>
      </FormField>
      <FormField v-slot="$field" name="participants">
        <IftaLabel>
          <InputText v-tooltip="'Enter a comma-separated list of emails'" type="text" id="participants" fluid />
          <label for="participants">Participants</label>
        </IftaLabel>
      </FormField>
      <FormField v-slot="$field" name="description" initialValue="">
        <IftaLabel>
          <Textarea id="description" rows="5" cols="30" style="resize: none" fluid />
          <label for="description">Description</label>
        </IftaLabel>
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
        </Message>
      </FormField>
      <Button type="submit" severity="primary" label="Create" />
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
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';

import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';

import { client } from "../../api/index";
import moment from 'moment-timezone';

const emit = defineEmits(['close']);

const toast = useToast();

const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    participants: z.string().optional(),
  })
);

const onFormSubmit = ({ values, valid, reset }) => {
  if (valid) {
    const req = {
      name: values.name,
      description: values.description,
    }
    if (values.participants) {
      req.participants = values.participants.split(',');
    }
    console.log(req);
    client.projects.createProject.mutate(req)
      .then((res) => {
        emit('close');
        reset();
        console.log(res);
        toast.add({ severity: 'success', summary: 'Project created.', life: 3000 });
      })
      .catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: `Failed to create project: ${err.message}.`, life: 3000 });
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