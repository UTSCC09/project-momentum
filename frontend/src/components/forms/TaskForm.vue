<template>
  <div>
    <Toast />
    <Form :resolver @submit="onFormSubmit">
      <div class="input-group">
        <FormField v-slot="$field" name="name" initialValue="">
          <IftaLabel>
            <InputText id="name" type="text" auto fluid />
            <label for="name">Name</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="project_id" initialValue="">
          <IftaLabel>
            <Select inputId="project" :options="projects" optionLabel="name" optionValue="value" fluid />
            <label for="project">Project</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
      <div class="input-group">
        <FormField v-slot="$field" name="location" initialValue="">
          <IftaLabel>
            <InputText type="text" id="location" fluid />
            <label for="location">Location</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="deadline" initialValue="">
          <IftaLabel>
            <DatePicker inputId="deadline" showTime hourFormat="24" fluid />
            <label for="deadline">Deadline</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
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
import DatePicker from 'primevue/datepicker';
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';
import Select from 'primevue/select';
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
    location: z.string().min(1, { message: 'Location is required.' }),
    deadline: z.date(),
    project_id: z.string().optional(),
  })
);

const onFormSubmit = ({ values, valid, reset }) => {
  if (valid) {
    const req = {
      name: values.name,
      description: values.description,
      location: values.location,
      deadline: moment(values.deadline).local().utc().toISOString(),
    }
    if (values.project_id) {
      req.project_id = values.project_id;
    }
    console.log(req);
    client.tasks.createTask.mutate(req)
      .then((res) => {
        emit('close');
        reset();
        console.log(res);
        toast.add({ severity: 'success', summary: 'Task created.', life: 3000 });
      })
      .catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: `Failed to create task: ${err.message}.`, life: 3000 });
      });
  }
};

const projects = ref([
  { name: "Project 1", value: "1" },
]);
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

.input-group {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.input-group .p-formfield {
  flex: 1 0 auto;
}
</style>
