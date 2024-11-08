<template>
  <div class="calendar-drawer-container">
    <SplitButton label="Create" @click="save" :model="items" />

    <Dialog v-model:visible="taskVisible" modal header="Create Task" :style="{ width: '50vw' }">
      <div class="error-message">{{ taskMsg }}</div>
      <div class="input-group">
        <IftaLabel>
          <InputText id="taskTitle" v-model="taskTitle" variant="filled" class="input-field" />
          <label for="taskTitle">Title</label>
        </IftaLabel>
        <IftaLabel>
          <Select v-model="taskProject" inputId="taskProject" :options="projects" optionLabel="name" optionValue="id"
            class="input-field" />
          <label for="taskProject">Project</label>
        </IftaLabel>
      </div>
      <div class="input-group">
        <IftaLabel>
          <InputText id="taskLocation" v-model="taskLocation" class="input-field" />
          <label for="taskLocation">Location</label>
        </IftaLabel>
        <IftaLabel>
          <DatePicker inputId="taskDeadline" v-model="taskDeadline" showTime hourFormat="24" fluid
            class="input-field" />
          <label for="taskDeadline">Deadline</label>
        </IftaLabel>
      </div>
      <div class="input-field-container">
        <IftaLabel>
          <Textarea id="taskDescription" v-model="taskDescription" rows="5" cols="30" style="resize: none"
            class="input-field" />
          <label for="taskDescription">Description</label>
        </IftaLabel>
      </div>
      <div class="save-button">
        <Button type="button" label="Save" @click="submitCreateTaskDialog" />
      </div>
    </Dialog>

    <Dialog v-model:visible="eventVisible" modal header="Create Event" :style="{ width: '50vw' }">
      <div class="error-message">{{ eventMsg }}</div>
      <div class="input-group">
        <IftaLabel>
          <InputText id="eventTitle" v-model="eventTitle" variant="filled" class="input-field" />
          <label for="eventTitle">Title</label>
        </IftaLabel>
        <IftaLabel>
          <Select v-model="eventProject" inputId="eventProject" :options="projects" optionLabel="name" optionValue="id"
            class="input-field" />
          <label for="eventProject">Project</label>
        </IftaLabel>
      </div>
      <div class="input-group">
        <IftaLabel>
          <InputText id="eventLocation" v-model="eventLocation" class="input-field" />
          <label for="eventLocation">Location</label>
        </IftaLabel>
        <IftaLabel>
          <DatePicker inputId="eventStartDatetime" v-model="eventStartDatetime" showTime hourFormat="24" fluid
            class="input-field" />
          <label for="eventStartDatetime">Start time</label>
        </IftaLabel>
        <IftaLabel>
          <DatePicker inputId="eventEndDatetime" v-model="eventEndDatetime" showTime hourFormat="24" fluid
            class="input-field" />
          <label for="eventEndDatetime">End time</label>
        </IftaLabel>
        <div class="checkbox">
          <Checkbox v-model="eventRepeat" inputId="eventRepeat" :binary="true" />
          <label for="eventRepeat">Repeat</label>
        </div>
      </div>
      <div class="input-group">
        <IftaLabel>
          <Select v-model="eventRepeatFrequency" inputId="eventRepeatFrequency" :options="frequencies"
            optionLabel="name" optionValue="value" class="input-field" />
          <label for="eventRepeatFrequency">Frequency</label>
        </IftaLabel>
        <IftaLabel>
          <InputNumber v-model="eventRepeatEvery" inputId="eventRepeatEvery" :min="1" class="input-field" />
          <label for="eventRepeatEvery">Every</label>
        </IftaLabel>
        <IftaLabel>
          <MultiSelect v-model="eventRepeatWeeklyDates" inputId="eventRepeatWeeklyDates" :options="repeatWeeklyDates"
            optionLabel="name" optionValue="value" filter class="input-field" />
          <label for="eventRepeatWeeklyDates">Weekly</label>
        </IftaLabel>
        <IftaLabel>
          <MultiSelect v-model="eventRepeatMonthlyDates" inputId="eventRepeatMonthlyDates" :options="repeatMonthlyDates"
            optionLabel="name" optionValue="value" filter class="input-field" />
          <label for="eventRepeatMonthlyDates">Monthly</label>
        </IftaLabel>
      </div>
      <div class="input-field-container">
        <IftaLabel>
          <Textarea id="taskDescription" v-model="taskDescription" rows="5" cols="30" style="resize: none"
            class="input-field" />
          <label for="taskDescription">Description</label>
        </IftaLabel>
      </div>
      <div class="save-button">
        <Button type="button" label="Save" @click="submitCreateTaskDialog" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import SplitButton from 'primevue/splitbutton';
import InputText from 'primevue/inputtext';
import IftaLabel from 'primevue/iftalabel';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';

import { ref } from 'vue';
import { client } from "../../api/index";
import { formatDate } from "../../api/utils";

const taskVisible = ref(false);
const taskTitle = ref(null);
const taskLocation = ref(null);
const taskDeadline = ref(null);
const taskDescription = ref(null);
const taskMsg = ref(null);
function clearCreateTaskDialog() {
  taskTitle.value = "";
  taskLocation.value = "";
  taskDeadline.value = "";
  taskDescription.value = ""
  taskMsg.value = "";
}
function hideCreateTaskDialog() {
  clearCreateTaskDialog();
  taskVisible.value = false;
}
function submitCreateTaskDialog() {
  client.tasks.createTask.mutate({
    name: taskTitle.value,
    description: taskDescription.value,
    location: taskLocation.value,
    deadline: formatDate(taskDeadline.value),
    project_id: taskProject.value,
  })
    .then((res) => {
      console.log(res);
      hideCreateTaskDialog();
    })
    .catch((err) => {
      taskMsg.value = err.message;
    });
}

const eventVisible = ref(false);
const eventTitle = ref(null);
const eventLocation = ref(null);
const eventStartDatetime = ref(null);
const eventEndDatetime = ref(null);
const eventRepeat = ref(null);
const eventRepeatFrequency = ref();
const frequencies = ref([
  { name: "daily", value: "daily" },
  { name: "weekly", value: "weekly" },
  { name: "monthly", value: "monthly" },
]);
const eventRepeatEvery = ref(null);
const eventRepeatWeeklyDates = ref();
const repeatWeeklyDates = ref([
  { name: "Monday", value: 1 },
  { name: "Tuesday", value: 2 },
  { name: "Wednesday", value: 3 },
  { name: "Thursday", value: 4 },
  { name: "Friday", value: 5 },
  { name: "Saturday", value: 6 },
  { name: "Sunday", value: 7 },
]);
const eventRepeatMonthlyDates = ref();
const repeatMonthlyDates = ref([
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
const eventMsg = ref(null);
function clearCreateEventDialog() {
  eventTitle.value = "";
  eventLocation.value = "";
  eventStartDatetime.value = "";
  eventEndDatetime.value = ""
  eventMsg.value = "";
}
function hideCreateEventDialog() {
  clearCreateEventDialog();
  eventVisible.value = false;
}

const items = [
  {
    label: 'Task',
    command: () => {
      taskVisible.value = true;
    }
  },
  {
    label: 'Event',
    command: () => {
      eventVisible.value = true;
    }
  },
  {
    label: 'Meeting',
    command: () => {
      console.log("Meeting");
    }
  },
  {
    separator: true
  },
  {
    label: 'Project',
    command: () => {
      console.log("Project");
    }
  }
];

const save = () => {
  console.log("Save");
};
</script>

<style lang="css" scoped>
.calendar-drawer-container {
  padding: var(--sx-spacing-padding6);
  position: sticky;
  top: var(--sx-spacing-padding6);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-field {
  width: 100%;
}

.input-group {
  margin-bottom: 5px;
  display: flex;
  gap: 5px;
  justify-content: space-between;
  align-items: center;
}

.input-group .p-iftalabel {
  flex-grow: 1;
}

.input-field-container {
  margin-bottom: 5px;
}

.save-button {
  display: flex;
  justify-content: center;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--p-iftalabel-color);
}
</style>
