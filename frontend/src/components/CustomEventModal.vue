<template>
  <div class="custom-event-modal">
    <input v-model="isChecked" type="checkbox" />
    <!-- <div>{{ calendarEvent.id }}</div> -->
    <div>{{ calendarEvent.title }}</div>
    <Panel header="Edit" toggleable>
      <form>
        <FloatLabel variant="on">
          <InputText id="on_label" />
          <label for="on_label">Title</label>
        </FloatLabel>
      </form>
    </Panel>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { useEventsStore } from "../store/events-store.ts";

// components
import Panel from 'primevue/panel';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';

const props = defineProps({
  calendarEvent: {
    type: Object as PropType<{ title: string; id: number | string }>,
    required: true,
  },
})

const isChecked = ref(false)

watch(isChecked, () => {
  eventsStore.toggleEvent(props.calendarEvent!.id)
})

const eventsStore = useEventsStore()

</script>

<style>
.custom-event-modal {
  padding: var(--sx-spacing-padding6);
  background-color: var(--sx-color-background);
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
  border-radius: var(--sx-rounding-small);
  max-height: 250px;
  overflow-y: scroll;
}
</style>