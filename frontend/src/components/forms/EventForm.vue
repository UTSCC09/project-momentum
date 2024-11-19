<template>
  <div>
    <Toast />
    <Form :resolver @submit="onFormSubmit">
      <div class="input-group" style="grid-template-columns: 3fr 1fr;">
        <FormField v-slot="$field" name="name">
          <IftaLabel>
            <InputText id="name" type="text" auto fluid />
            <label for="name">Name</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="project_id">
          <IftaLabel>
            <Select inputId="project" :options="projects" optionLabel="name" optionValue="value" fluid />
            <label for="project">Project</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
      <div class="input-group" style="grid-template-columns: 3fr 3fr 3fr 1fr;">
        <FormField v-slot="$field" name="location">
          <IftaLabel>
            <InputText type="text" id="location" fluid />
            <label for="location">Location</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="startTime">
          <IftaLabel>
            <DatePicker inputId="startTime" showTime hourFormat="24" fluid />
            <label for="startTime">Starts</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="endTime">
          <IftaLabel>
            <DatePicker inputId="endTime" showTime hourFormat="24" fluid />
            <label for="endTime">Ends</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="repeat" class="checkbox">
          <Checkbox inputId="repeat" :binary="true" @change="toggleRecurrence" />
          <label for="repeat">Repeat</label>
        </FormField>
      </div>
      <div v-if="visibleRecurrence" class="input-group" style="grid-template-columns: 1fr 1fr 1fr 1fr;">
        <FormField v-slot="$field" name="frequency">
          <IftaLabel>
            <Select v-model="frequency" inputId="frequency" :options="frequencies" optionLabel="name" optionValue="value" fluid />
            <label for="frequency">Frequency</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="interval">
          <IftaLabel>
            <InputNumber v-if="frequency=='daily'" inputId="interval" :min="1" suffix=" days" showButtons fluid />
            <InputNumber v-if="frequency=='weekly'" inputId="interval" :min="1" suffix=" weeks" showButtons fluid />
            <InputNumber v-if="frequency=='monthly'" inputId="interval" :min="1" suffix=" months" showButtons fluid />
            <InputNumber v-if="!frequency" inputId="interval" :min="1" showButtons fluid />
            <label for="interval">Every</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-if="frequency=='daily' || frequency=='weekly'" v-slot="$field" name="byday">
          <IftaLabel>
            <MultiSelect inputId="byday" :options="weeklyDates" optionLabel="name" optionValue="value"
              :maxSelectedLabels="2" fluid />
            <label for="byday">By day</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-if="frequency=='monthly'" v-slot="$field" name="bymonth">
          <IftaLabel>
            <MultiSelect inputId="bymonth" :options="monthlyDates" optionLabel="name" optionValue="value"
              :maxSelectedLabels="2" fluid />
            <label for="bymonth">By month</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="until">
          <InputGroup class="md:w-80">
            <InputGroupAddon>
              <ToggleButton v-model="countUntil" onLabel="Count" offLabel="Date" fluid />
            </InputGroupAddon>
            <IftaLabel>
              <InputNumber v-if="countUntil" inputId="until" />
              <DatePicker v-else inputId="until" />
              <label for="until">Until</label>
            </IftaLabel>
          </InputGroup>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
      <FormField v-slot="$field" name="description">
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
import Checkbox from 'primevue/checkbox';
import DatePicker from 'primevue/datepicker';
import IftaLabel from 'primevue/iftalabel';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToggleButton from 'primevue/togglebutton';

import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';

import { client } from "../../api/index";
import { formatDatetime } from "../../api/utils";

const emit = defineEmits(['close']);

// const props = defineProps({
//   initialValues: {
//     type: Object as PropType<{
//       name: string,
//       description: string,
//       location: string,
//       startTime: Date,
//       endTime: Date,
//       repeat: boolean,
//       frequency: "daily" | "monthly" | "weekly",
//       every: number,
//       weekly: number[],
//       monthly: number[],
//       project_id?: any,
//     }>,
//     required: false,
//   },
// })

const countUntil = ref(true);
const frequency = ref();

const toast = useToast();

const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    location: z.string().min(1, { message: 'Location is required.' }),
    startTime: z.date(),
    endTime: z.date(),
    repeat: z.any(),
    frequency: z.any(),
    interval: z.any().optional(),
    byweek: z.any().optional(),
    bymonth: z.any().optional(),
    until: z.union([z.date(), z.number()]).optional(),
    project_id: z.string().optional(),
  })
);

const onFormSubmit = ({ values, valid, reset }) => {
  console.log(values);
  if (valid) {
    console.log("valid");
    const req = {
      name: values.name,
      description: values.description,
      location: values.location,
      start_time: formatDatetime(values.startTime),
      end_time: formatDatetime(values.endTime),
    }
    if (values.repeat) {
      req.rrule = "";
    }
    console.log(req);
    client.events.createEvent.mutate(req)
      .then((res) => {
        emit('close');
        reset();
        console.log(res);
        toast.add({ severity: 'success', summary: 'Task created.', life: 3000 });
      })
      .catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: `Failed to create task: ${err.message}.`, });
      });
  }
};

const projects = ref([
  { name: "Project 1", value: "1" },
]);

const frequencies = ref([
  { name: "daily", value: "daily" },
  { name: "weekly", value: "weekly" },
  { name: "monthly", value: "monthly" },
]);

const weeklyDates = ref([
  { name: "Monday", value: 1 },
  { name: "Tuesday", value: 2 },
  { name: "Wednesday", value: 3 },
  { name: "Thursday", value: 4 },
  { name: "Friday", value: 5 },
  { name: "Saturday", value: 6 },
  { name: "Sunday", value: 7 },
]);

const monthlyDates = ref([
  { name: "1", value: 1 }, { name: "2", value: 2 }, { name: "3", value: 3 },
  { name: "4", value: 4 }, { name: "5", value: 5 }, { name: "6", value: 6 },
  { name: "7", value: 7 }, { name: "8", value: 8 }, { name: "9", value: 9 },
  { name: "10", value: 10 }, { name: "11", value: 11 }, { name: "12", value: 12 },
  { name: "13", value: 13 }, { name: "14", value: 14 }, { name: "15", value: 15 },
  { name: "16", value: 16 }, { name: "17", value: 17 }, { name: "18", value: 18 },
  { name: "19", value: 19 }, { name: "20", value: 20 }, { name: "21", value: 21 },
  { name: "22", value: 22 }, { name: "23", value: 23 }, { name: "24", value: 24 },
  { name: "25", value: 25 }, { name: "26", value: 26 }, { name: "27", value: 27 },
  { name: "28", value: 28 }, { name: "29", value: 29 }, { name: "30", value: 30 },
  { name: "31", value: 31 },
]);

const visibleRecurrence = ref(false);

function showRecurrence() {
  visibleRecurrence.value = true;
}

function hideRecurrence() {
  // clear and hide
  visibleRecurrence.value = false;
}

function toggleRecurrence(event) {
  // console.log(event.target.checked);
  if (event.target.checked) {
    showRecurrence();
  }
  else {
    hideRecurrence();
  }
} 
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
  display: grid;
  column-gap: 1rem;
  align-items: center;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--p-iftalabel-color);
}

.checkbox {
  color: var(--p-iftalabel-color);
  width: fit-content;
}

.p-inputgroupaddon {
  padding: 0;
}

.p-togglebutton {
  --p-togglebutton-content-checked-shadow: none;
  --p-togglebutton-content-checked-background: var(--p-surface-100);
  width: 100%;
  height: 100%;
  font-size: small;
}
</style>
