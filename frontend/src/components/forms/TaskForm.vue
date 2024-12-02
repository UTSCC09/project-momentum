<template>
  <div>
    <Toast />

    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
      <div class="input-group">
        <div>
          <IftaLabel>
            <InputText name="name" id="name" type="text" auto fluid />
            <label for="name">Name</label>
          </IftaLabel>
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
            $form.name.error?.message }}
          </Message>
        </div>
        <div>
          <IftaLabel>
            <Select name="project_id" inputId="project" :options="projects" optionLabel="name" optionValue="value"
              fluid />
            <label for="project">Project</label>
          </IftaLabel>
          <Message v-if="$form.project_id?.invalid" severity="error" size="small" variant="simple">{{
            $form.project_id.error?.message }}
          </Message>
        </div>
      </div>
      <div class="input-group">
        <div>
          <IftaLabel>
            <InputText name="location" type="text" id="location" fluid />
            <label for="location">Location</label>
          </IftaLabel>
          <Message v-if="$form.location?.invalid" severity="error" size="small" variant="simple">{{
            $form.location.error?.message }}
          </Message>
        </div>
        <div>
          <IftaLabel>
            <DatePicker name="deadline" inputId="deadline" showTime hourFormat="24" fluid />
            <label for="deadline">Deadline</label>
          </IftaLabel>
          <Message v-if="$form.deadline?.invalid" severity="error" size="small" variant="simple">{{
            $form.deadline.error?.message }}
          </Message>
        </div>
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
      <div class="checkbox-container">
        <Checkbox name="create_event" inputId="create_event" binary />
        <label for="create_event">Automatically create an event for your task</label>
        <Message v-if="$form.create_event?.invalid" severity="error" size="small" variant="simple">{{
          $form.create_event.error?.message }}
        </Message>
      </div>
      <Button type="submit" severity="primary" label="Submit" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import DatePicker from 'primevue/datepicker';
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';

import { ref, reactive, onBeforeMount } from 'vue';
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

const props = defineProps({
  initialValues: {
    type: Object as PropType<{
      name?: string,
      description?: string,
      location?: string,
      deadline?: Date,
      project_id?: string,
      create_event?: boolean,
    }>,
    required: false,
  }
});

const initialValues = reactive(props.initialValues);

const toast = useToast();

const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    description: z.string().optional(),
    location: z.string().optional(),
    deadline: z.date().optional(),
    project_id: z.string().optional(),
    create_event: z.boolean().optional(),
  })
);

const onFormSubmit = ({ values, valid, reset }) => {
  if (valid) {
    const req = Object.assign({},
      values.name && { name: values.name },
      values.description && { description: values.description },
      values.location && { location: values.location },
      values.deadline && { deadline: moment(values.deadline).local().utc().toISOString() },
      values.create_event && { create_event: values.create_event },
      values.project_id && { project_id: values.project_id },
    );
    client.tasks.createTask.mutate(req)
      .then((res) => {
        // send event to parent to close the dialog
        emit('close');

        // clear all input from form
        initialValues.values = {};

        if (res && res.event) {
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
      })
      .catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: `Failed to create task: ${err.message}.`, life: 3000 });
      });
  }
};

const projects = ref<{ string, string }[]>([]);

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

.input-group {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.input-group div {
  flex: 1 0 auto;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
