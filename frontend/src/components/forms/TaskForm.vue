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
      <FormField v-slot="$field" name="create_event" initialValue="">
        <div class="checkbox-container">
          <Checkbox inputId="create_event" :binary="true" />
          <label for="create_event">Automatically create an event for your task</label>
        </div>
      </FormField>
      <Button type="submit" severity="primary" label="Create" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form } from '@primevue/forms';
import { FormField } from '@primevue/forms';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import DatePicker from 'primevue/datepicker';
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';

import { ref, onBeforeMount } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';

import { client } from "../../api/index";
import moment from 'moment-timezone';

import { useCalendarStore } from "../../stores/calendar.store.ts";
import { useAuthStore } from '../../stores/auth.store.ts';

const emit = defineEmits(['close']);

const authStore = useAuthStore();
const calendarStore = useCalendarStore();

const toast = useToast();

const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    location: z.string().min(1, { message: 'Location is required.' }),
    deadline: z.date(),
    project_id: z.string().optional(),
    create_event: z.boolean().optional(),
  })
);

const onFormSubmit = ({ values, valid, reset }) => {
  if (valid) {
    const req = {
      name: values.name,
      description: values.description,
      location: values.location,
      deadline: moment(values.deadline).local().utc().toISOString(),
      create_event: values.create_event ? true : false,
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

        if (res.event) {
          calendarStore.addEvent({
          id: res.event.id,
          title: res.event.name,
          description: res.event.description,
          location: res.event.location,
          start: moment.utc(res.event.start_time).local().format("YYYY-MM-DD HH:mm"),
          end: moment.utc(res.event.end_time).local().format("YYYY-MM-DD HH:mm"),
          rrule: res.event.rrule,
          type: "event",
        });
        }
        toast.add({ severity: 'success', summary: 'Task created.', life: 3000 });
      })
      .catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: `Failed to create task: ${err.message}.`, life: 3000 });
      });
  }
};

const projects = ref([]);

onBeforeMount(() => {
  client.projects.getProjectbyLead.query({ uid: authStore.user })
    .then((res) => {
      console.log(res);
      for (const project of res.projects) {
        projects.value.push({ name: project.name, value: project.id });
      }
    })
    .catch((err) => {
      console.log(err);
    })
});
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

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
