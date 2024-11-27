<template>
  <div>
    <Toast />
    <Form :resolver @submit="onFormSubmit">
      <div class="input-group" style="grid-template-columns: 3fr 1fr;">
        <FormField v-slot="$field" name="name">
          <IftaLabel>
            <InputText id="name" type="text" v-model="name" auto fluid />
            <label for="name">Name</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="project_id">
          <IftaLabel>
            <Select inputId="project" :options="projects" optionLabel="name" optionValue="value" v-model="project_id"
              fluid />
            <label for="project">Project</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
      <FormField v-slot="$field" name="participants">
        <IftaLabel>
          <InputText v-tooltip="'Enter a comma-separated list of emails'" type="text" id="participants" fluid />
          <label for="participants">Participants</label>
        </IftaLabel>
      </FormField>
      <div class="input-group" style="grid-template-columns: 3fr 3fr 3fr 1fr;">
        <FormField v-slot="$field" name="location">
          <IftaLabel>
            <InputText type="text" id="location" v-model="location" fluid />
            <label for="location">Location</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="startTime">
          <IftaLabel>
            <DatePicker inputId="startTime" v-model="startTime" showTime hourFormat="24" fluid />
            <label for="startTime">Starts</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="endTime">
          <IftaLabel>
            <DatePicker inputId="endTime" v-model="endTime" showTime hourFormat="24" fluid />
            <label for="endTime">Ends</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="repeat" class="checkbox">
          <Checkbox inputId="repeat" :binary="true" v-model="repeat" @change="toggleRecurrence" />
          <label for="repeat">Repeat</label>
        </FormField>
      </div>
      <div v-if="repeat" class="input-group" style="grid-template-columns: 1fr 1fr 1fr 1fr;">
        <FormField v-slot="$field" name="frequency">
          <IftaLabel>
            <Select v-model="frequency" inputId="frequency" :options="frequencies" optionLabel="name"
              optionValue="value" fluid />
            <label for="frequency">Frequency</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="interval">
          <IftaLabel>
            <InputNumber v-if="frequency == 'DAILY'" inputId="interval" :min="1" suffix=" days" v-model="interval"
              showButtons fluid />
            <InputNumber v-if="frequency == 'WEEKLY'" inputId="interval" :min="1" suffix=" weeks" v-model="interval"
              showButtons fluid />
            <InputNumber v-if="frequency == 'MONTHLY'" inputId="interval" :min="1" suffix=" months" v-model="interval"
              showButtons fluid />
            <InputNumber v-if="!frequency" inputId="interval" :min="1" v-model="interval" showButtons fluid />
            <label for="interval">Every</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-if="frequency == 'DAILY' || frequency == 'WEEKLY'" v-slot="$field" name="byday">
          <IftaLabel>
            <MultiSelect inputId="byday" :options="weeklyDates" optionLabel="name" optionValue="value"
              :maxSelectedLabels="2" v-model="byday" fluid />
            <label for="byday">By day</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-if="frequency == 'MONTHLY'" v-slot="$field" name="bymonthday">
          <IftaLabel>
            <MultiSelect inputId="bymonthday" :options="monthlyDates" optionLabel="name" optionValue="value"
              :maxSelectedLabels="2" v-model="bymonthday" fluid />
            <label for="bymonthday">By month</label>
          </IftaLabel>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="until">
          <InputGroup class="md:w-80">
            <IftaLabel>
              <DatePicker v-model="until" inputId="until" hourFormat="24" fluid />
              <label for="until">Until</label>
            </IftaLabel>
          </InputGroup>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
      <FormField v-slot="$field" name="description">
        <IftaLabel>
          <Textarea id="description" rows="5" cols="30" style="resize: none" v-model="description" fluid />
          <label for="description">Description</label>
        </IftaLabel>
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
        </Message>
      </FormField>
      <Button type="submit" severity="primary" label="Submit" />
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

import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';

import { client } from "../../api/index";
import moment from 'moment-timezone';

import { useCalendarStore } from "../../stores/calendar.store.ts";

const emit = defineEmits(['close']);

const calendarStore = useCalendarStore();

function formatRecurrence(values) {
  if (values.repeat) {
    let recurrence = "";
    recurrence += `FREQ=${values.frequency};`;
    recurrence += `INTERVAL=${values.interval ? values.interval.toString() : '1'};`;
    recurrence += `UNTIL=${moment(values.until).local().format("YYYYMMDD")};`;
    recurrence += values.byday ? `BYDAY=${values.byday.toString()};` : '';
    recurrence += values.bymonthday ? `BYMONTHDAY=${values.bymonthday.toString()};` : '';
    return recurrence;
  }
}

const props = defineProps({
  initialValues: {
    type: Object as PropType<{
      name?: string,
      description?: string,
      location?: string,
      startTime?: Date,
      endTime?: Date,
      repeat?: boolean,
      frequency?: "DAILY" | "WEEKLY" | "MONTHLY",
      interval?: number,
      byday?: string[],
      bymonthday?: number[],
      until?: Date,
      project_id?: string,
      participants?: string,
    }>,
    required: false,
    default: () => ({
      name: '',
      description: '',
      location: '',
      startTime: null,
      endTime: null,
      repeat: false,
      frequency: 'DAILY',
      interval: 1,
      byday: [],
      bymonthday: [],
      until: null,
      project_id: '',
      participants: '',
    })
  }
});

const name = ref(props.initialValues.name);
const description = ref(props.initialValues.description);
const location = ref(props.initialValues.location);
const startTime = ref(props.initialValues.startTime);
const endTime = ref(props.initialValues.endTime);
const repeat = ref(props.initialValues.repeat);
const frequency = ref(props.initialValues.frequency);
const interval = ref(props.initialValues.interval);
const byday = ref(props.initialValues.byday);
const bymonthday = ref(props.initialValues.bymonthday);
const until = ref(props.initialValues.until);
const project_id = ref(props.initialValues.project_id);
const participants = ref(props.initialValues.participants);

const toast = useToast();

const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    location: z.string().min(1, { message: 'Location is required.' }),
    startTime: z.date(),
    endTime: z.date(),
    repeat: z.union([z.boolean(), z.undefined()]),
    frequency: z.union([z.literal("DAILY"), z.literal("WEEKLY"), z.literal("MONTHLY")]).optional(),
    interval: z.any().optional(),
    byday: z.any().optional(),
    bymonthday: z.any().optional(),
    until: z.date().optional(),
    project_id: z.string().optional(),
    participants: z.string().optional(),
  })
);

const onFormSubmit = ({ values, valid, reset }) => {
  console.log(`Received MeetingForm:`);
  console.log(values);
  if (valid) {
    const req = {
      name: values.name,
      description: values.description,
      location: values.location,
      start_time: moment(values.startTime).local().utc().toISOString(),
      end_time: moment(values.endTime).local().utc().toISOString(),
    }
    if (values.participants) {
      req.participants = values.participants.split(',');
    }
    if (values.repeat) {
      req.rrule = formatRecurrence(values);
      req.end_recurrence = moment(values.until).local().utc().toISOString();
    }
    console.log(`Sending request to createMeeting:`);
    console.log(req);
    client.meetings.createMeeting.mutate(req)
      .then((res) => {
        emit('close');
        reset();
        console.log(`Received response from createMeeting:`);
        console.log(res);
        calendarStore.addEvent({
          id: res.meeting.id,
          title: res.meeting.name,
          description: res.meeting.description,
          location: res.meeting.location,
          start: moment.utc(res.meeting.start_time).local().format("YYYY-MM-DD HH:mm"),
          end: moment.utc(res.meeting.end_time).local().format("YYYY-MM-DD HH:mm"),
          rrule: res.meeting.rrule,
          type: "meeting",
        })
        toast.add({ severity: 'success', summary: 'Meeting created.', life: 3000 });
      })
      .catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: `Failed to create meeting: ${err.message}.`, life: 3000 });
      });
  }
  else {
    toast.add({ severity: 'error', summary: `Invalid form values.`, life: 3000 });
  }
};

const projects = ref([
  { name: "Project 1", value: "1" },
]);

const frequencies = ref([
  { name: "daily", value: "DAILY" },
  { name: "weekly", value: "WEEKLY" },
  { name: "monthly", value: "MONTHLY" },
]);

const weeklyDates = ref([
  { name: "Monday", value: "MO" },
  { name: "Tuesday", value: "TU" },
  { name: "Wednesday", value: "WE" },
  { name: "Thursday", value: "TH" },
  { name: "Friday", value: "FR" },
  { name: "Saturday", value: "SA" },
  { name: "Sunday", value: "SU" },
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
