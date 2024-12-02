<template>
  <div>
    <Toast />

    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
      <div class="input-group" style="grid-template-columns: 3fr 1fr">
        <div>
          <IftaLabel>
            <InputText name="name" id="name" type="text" auto fluid />
            <label for="name">Name</label>
          </IftaLabel>
          <Message
            v-if="$form.name?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.name.error?.message }}
          </Message>
        </div>
        <div>
          <IftaLabel>
            <Select
              name="project_id"
              inputId="project"
              :options="projects"
              optionLabel="name"
              optionValue="value"
              fluid
            />
            <label for="project">Project</label>
          </IftaLabel>
          <Message
            v-if="$form.project_id?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.project_id.error?.message }}
          </Message>
        </div>
      </div>
      <div>
        <IftaLabel>
          <InputText
            name="participants"
            v-tooltip="'Enter a comma-separated list of emails'"
            type="text"
            id="participants"
            fluid
          />
          <label for="participants">Participants</label>
        </IftaLabel>
        <Message
          v-if="$form.participants?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.participants.error?.message }}
        </Message>
      </div>
      <div class="input-group" style="grid-template-columns: 3fr 3fr 3fr 1fr">
        <div>
          <IftaLabel>
            <InputText name="location" type="text" id="location" fluid />
            <label for="location">Location</label>
          </IftaLabel>
          <Message
            v-if="$form.location?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.location.error?.message }}
          </Message>
        </div>
        <div>
          <IftaLabel>
            <DatePicker
              name="start_time"
              inputId="start_time"
              showTime
              hourFormat="24"
              fluid
            />
            <label for="start_time">Starts</label>
          </IftaLabel>
          <Message
            v-if="$form.start_time?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.start_time.error?.message }}
          </Message>
        </div>
        <div>
          <IftaLabel>
            <DatePicker
              name="end_time"
              inputId="end_time"
              showTime
              hourFormat="24"
              fluid
            />
            <label for="end_time">Ends</label>
          </IftaLabel>
          <Message
            v-if="$form.end_time?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.end_time.error?.message }}
          </Message>
        </div>
        <div class="checkbox">
          <Checkbox name="repeat" inputId="repeat" :binary="true" />
          <label for="repeat">Repeat</label>
        </div>
      </div>
      <div
        v-if="$form.repeat?.value"
        class="input-group"
        style="grid-template-columns: 1fr 1fr 1fr 1fr"
      >
        <div>
          <IftaLabel>
            <Select
              name="frequency"
              inputId="frequency"
              :options="frequencies"
              optionLabel="name"
              optionValue="value"
              fluid
            />
            <label for="frequency">Frequency</label>
          </IftaLabel>
          <Message
            v-if="$form.frequency?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.frequency.error?.message }}
          </Message>
        </div>
        <div>
          <IftaLabel>
            <InputNumber
              name="interval"
              v-if="$form.frequency?.value == 'DAILY'"
              inputId="interval"
              :min="1"
              suffix=" days"
              showButtons
              fluid
            />
            <InputNumber
              name="interval"
              v-if="$form.frequency?.value == 'WEEKLY'"
              inputId="interval"
              :min="1"
              suffix=" weeks"
              showButtons
              fluid
            />
            <InputNumber
              name="interval"
              v-if="$form.frequency?.value == 'MONTHLY'"
              inputId="interval"
              :min="1"
              suffix=" months"
              showButtons
              fluid
            />
            <label for="interval">Every</label>
          </IftaLabel>
          <Message
            v-if="$form.interval?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.interval.error?.message }}
          </Message>
        </div>
        <div
          v-if="
            $form.frequency?.value == 'DAILY' ||
            $form.frequency?.value == 'WEEKLY'
          "
        >
          <IftaLabel>
            <MultiSelect
              name="byday"
              inputId="byday"
              :options="weeklyDates"
              optionLabel="name"
              optionValue="value"
              :maxSelectedLabels="2"
              fluid
            />
            <label for="byday">By day</label>
          </IftaLabel>
          <Message
            v-if="$form.byday?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.byday.error?.message }}
          </Message>
        </div>
        <div v-if="$form.frequency?.value == 'MONTHLY'">
          <IftaLabel>
            <MultiSelect
              name="bymonthday"
              inputId="bymonthday"
              :options="monthlyDates"
              optionLabel="name"
              optionValue="value"
              :maxSelectedLabels="2"
              fluid
            />
            <label for="bymonthday">By month</label>
          </IftaLabel>
          <Message
            v-if="$form.bymonthday?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.bymonthday.error?.message }}
          </Message>
        </div>
        <div>
          <InputGroup>
            <IftaLabel>
              <DatePicker name="until" inputId="until" hourFormat="24" fluid />
              <label for="until">Until</label>
            </IftaLabel>
          </InputGroup>
          <Message
            v-if="$form.until?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.until.error?.message }}
          </Message>
        </div>
      </div>
      <div>
        <IftaLabel>
          <Textarea
            name="description"
            id="description"
            rows="5"
            cols="30"
            style="resize: none"
            fluid
          />
          <label for="description">Description</label>
        </IftaLabel>
        <Message
          v-if="$form.description?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.description.error?.message }}
        </Message>
      </div>
      <Button type="submit" severity="primary" label="Submit" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form } from "@primevue/forms";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import DatePicker from "primevue/datepicker";
import IftaLabel from "primevue/iftalabel";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import MultiSelect from "primevue/multiselect";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";

import { ref, reactive, onBeforeMount } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";

import { client } from "../../api/index";
import moment from "moment-timezone";

import { useCalendarStore } from "../../stores/calendar.store.ts";
import { useAuthStore } from "../../stores/auth.store.ts";

const emit = defineEmits(["close"]);

const calendarStore = useCalendarStore();
const authStore = useAuthStore();

function formatRecurrence(values) {
  if (values.repeat) {
    let recurrence = "";
    recurrence += `FREQ=${values.frequency};`;
    recurrence += `INTERVAL=${values.interval ? values.interval.toString() : "1"};`;
    recurrence += `UNTIL=${moment(values.until).local().format("YYYYMMDD")};`;
    recurrence += values.byday ? `BYDAY=${values.byday.toString()};` : "";
    recurrence += values.bymonthday
      ? `BYMONTHDAY=${values.bymonthday.toString()};`
      : "";
    return recurrence;
  }
}

const props = defineProps({
  initialValues: {
    type: Object as PropType<{
      name?: string;
      description?: string;
      location?: string;
      startTime?: Date;
      endTime?: Date;
      repeat?: boolean;
      frequency?: "DAILY" | "WEEKLY" | "MONTHLY";
      interval?: number;
      byday?: string[];
      bymonthday?: number[];
      until?: Date;
      project_id?: string;
      participants?: string;
    }>,
    required: false,
  },
});

const initialValues = reactive(props.initialValues || {});

const toast = useToast();

const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: "Name is required." }),
    description: z.string().optional(),
    location: z.string().optional(),
    start_time: z.date(),
    end_time: z.date(),
    repeat: z.boolean().optional(),
    frequency: z
      .union([z.literal("DAILY"), z.literal("WEEKLY"), z.literal("MONTHLY")])
      .optional(),
    interval: z.number().optional(),
    byday: z.string().array().optional(),
    bymonthday: z.number().array().optional(),
    until: z.date().optional(),
    project_id: z.string().optional(),
    participants: z.string().array().optional(),
  }),
);

const onFormSubmit = ({ values, valid, reset }) => {
  if (valid) {
    const req = Object.assign(
      {},
      values.name && { name: values.name },
      values.description && { description: values.description },
      values.location && { location: values.location },
      { start_time: values.start_time },
      { end_time: values.end_time },
      values.project_id && { pid: values.project_id },
      values.repeat && { rrule: formatRecurrence(values) },
      values.participants && { participants: values.participants.split(",") },
    );

    client.meetings.createMeeting
      .mutate(req)
      .then((res) => {
        // send event to parent to close the dialog
        emit("close");

        // clear all input
        initialValues.values = {};

        calendarStore.addEvent({
          id: res.meeting.id,
          title: res.meeting.name,
          description: res.meeting.description,
          location: res.meeting.location,
          start: moment
            .utc(res.meeting.start_time)
            .local()
            .format("YYYY-MM-DD HH:mm"),
          end: moment
            .utc(res.meeting.end_time)
            .local()
            .format("YYYY-MM-DD HH:mm"),
          rrule: res.meeting.rrule,
          type: "meeting",
        });
      })
      .catch((err) => {
        console.error(err);
        toast.add({
          severity: "error",
          summary: `Failed to create meeting: ${err.message}.`,
          life: 3000,
        });
      });
  } else {
    toast.add({
      severity: "error",
      summary: `Invalid form values.`,
      life: 3000,
    });
  }
};

const projects = ref([]);

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
  { name: "1", value: 1 },
  { name: "2", value: 2 },
  { name: "3", value: 3 },
  { name: "4", value: 4 },
  { name: "5", value: 5 },
  { name: "6", value: 6 },
  { name: "7", value: 7 },
  { name: "8", value: 8 },
  { name: "9", value: 9 },
  { name: "10", value: 10 },
  { name: "11", value: 11 },
  { name: "12", value: 12 },
  { name: "13", value: 13 },
  { name: "14", value: 14 },
  { name: "15", value: 15 },
  { name: "16", value: 16 },
  { name: "17", value: 17 },
  { name: "18", value: 18 },
  { name: "19", value: 19 },
  { name: "20", value: 20 },
  { name: "21", value: 21 },
  { name: "22", value: 22 },
  { name: "23", value: 23 },
  { name: "24", value: 24 },
  { name: "25", value: 25 },
  { name: "26", value: 26 },
  { name: "27", value: 27 },
  { name: "28", value: 28 },
  { name: "29", value: 29 },
  { name: "30", value: 30 },
  { name: "31", value: 31 },
]);

onBeforeMount(() => {
  client.projects.getProjectbyLead
    .query({ uid: authStore.user })
    .then((res) => {
      for (const project of res.projects) {
        projects.value.push({ name: project.name, value: project.id });
      }
    })
    .catch((err) => {
      console.error(err);
    });
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
