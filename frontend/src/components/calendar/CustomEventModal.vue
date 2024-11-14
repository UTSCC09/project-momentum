<template>
  <div class="custom-event-modal">
    <!-- <input v-model="isChecked" type="checkbox" /> -->

    <div class="event-title-container">
      <p class="event-title">{{ calendarEvent.title }}</p>
      <Button icon="pi pi-pencil" @click="visible = true" variant="text" />
    </div>
    <div class="event-subtitle-container">
      <p><i class="pi pi-map-marker" style="font-size: 0.75rem"></i> {{ calendarEvent.location }}</p>
      <p><i class="pi pi-clock" style="font-size: 0.75rem"></i> {{ `${calendarEvent.start} - ${calendarEvent.end}` }}
      </p>
    </div>
    <p class="event-description">{{ calendarEvent.description }}</p>

    <Dialog v-model:visible="visible" modal header="Edit Event" :style="{ width: '50vw' }">
      <div>
        <IftaLabel>
          <InputText id="title" v-model="title" variant="filled" />
          <label for="title">Title</label>
        </IftaLabel>
      </div>
      <div>
        <IftaLabel>
          <InputText id="location" v-model="location" />
          <label for="location">Location</label>
        </IftaLabel>
      </div>
      <div id="datetime">
        <IftaLabel>
          <DatePicker id="startDateTime" v-model="startDateTime" showTime hourFormat="24" fluid />
          <label for="startDateTime">From</label>
        </IftaLabel>
        <IftaLabel>
          <DatePicker id="endDateTime" v-model="endDateTime" showTime hourFormat="24" fluid />
          <label for="endDateTime">To</label>
        </IftaLabel>
      </div>
      <div>
        <IftaLabel>
          <Textarea id="description" v-model="description" rows="5" cols="30" style="resize: none" />
          <label for="description">Description</label>
        </IftaLabel>
      </div>
      <div id="event-edit-save-button">
        <Button label="Save" @click="visible = false;" />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { useEventsStore } from "../../stores/events.store.ts";

// components
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

const props = defineProps({
  calendarEvent: {
    type: Object as PropType<{
      title: string; id: number | string,
      description: string, location: string,
      start: string, end: string
    }>,
    required: true,
  },
})

const title = ref(props.calendarEvent.title);
const startDateTime = ref(new Date(props.calendarEvent.start));
const endDateTime = ref(new Date(props.calendarEvent.end));

const isChecked = ref(false)
watch(isChecked, () => {
  eventsStore.toggleEvent(props.calendarEvent!.id)
})

const eventsStore = useEventsStore()

const visible = ref(false);

const description = ref(props.calendarEvent.description);
const location = ref(props.calendarEvent.location);

</script>

<style lang="css" scoped>
.custom-event-modal {
  padding: var(--sx-spacing-padding6);
  background-color: var(--sx-color-background);
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
  border-radius: var(--sx-rounding-small);
  max-height: 250px;
  overflow-y: scroll;
}

#title,
#location,
#description {
  width: 100%;
}

.p-dialog-content div {
  margin: 5px 0;
}

#datetime {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 5px;
}

#datetime span {
  flex-grow: 1;
}

.sx__calendar-wrapper button {
  background-color: none;
  color: var(--sx-on-primary-container);
}

.event-title-container {
  display: flex;
  justify-content: space-between;
  justify-items: center;
}

.event-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.event-subtitle-container {
  font-size: 0.75rem;
}

#event-edit-save-button {
  display: flex;
  justify-content: center;
}
</style>