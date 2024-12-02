<template>
  <div>
    <Toast />

    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
      <div>
        <IftaLabel>
          <InputText name="name" id="name" type="text" auto fluid />
          <label for="name">Name</label>
        </IftaLabel>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message
          }}
        </Message>
      </div>
      <div>
        <IftaLabel>
          <InputText name="participants" v-tooltip="'Enter a comma-separated list of emails'" type="text"
            id="participants" fluid />
          <label for="participants">Participants</label>
        </IftaLabel>
        <Message v-if="$form.participants?.invalid" severity="error" size="small" variant="simple">{{
          $form.participants.error?.message
        }}
        </Message>
      </div>
      <div>
        <IftaLabel>
          <Textarea name="description" id="description" rows="5" cols="30" style="resize: none" fluid />
          <label for="description">Description</label>
        </IftaLabel>
        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">{{
          $form.description.error?.message }}
        </Message>
      </div>
      <Button type="submit" severity="primary" label="Create" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';

import { ref, reactive } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';

import { client } from "../../api/index";
import moment from 'moment-timezone';

const emit = defineEmits(['close']);

const props = defineProps({
  initialValues: {
    type: Object as PropType<{
      name?: string,
      description?: string,
      participants?: string,
    }>,
    required: false,
  }
});

const initialValues = reactive(props.initialValues || {});

const toast = useToast();

const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    description: z.string().optional(),
    participants: z.string().optional(),
  })
);

const onFormSubmit = ({ values, valid, reset }) => {
  if (valid) {
    const req = Object.assign({},
      values.name && { name: values.name },
      values.description && { description: values.description },
      values.participants && { participants: values.participants.split(',') },
    );

    client.projects.createProject.mutate(req)
      .then((res) => {
        // send event to parent to close the dialog
        emit('close');

        // clear all input from form
        reset();
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
</style>