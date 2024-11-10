<template>
  <header class="sx__calendar-header">
    <UserMenu view="Tasks"/>
  </header>
  <div class="card">
    <Toast />
    <Panel toggleable>
      <template #header>
        <span>Project Name</span>
      </template>
      <template #icons>
        <Button icon="pi pi-cog" severity="secondary" rounded text @click="toggle" />
        <Menu ref="menu" id="config_menu" :model="items" popup />
      </template>
      <KanbanTaskGroup />
      <!-- This is the kanban board. -->
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from "primevue/usetoast";
import Menu from 'primevue/menu';
import Panel from 'primevue/panel';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import UserMenu from '../calendar/UserMenu.vue';
import KanbanTaskGroup from './KanbanTaskGroup.vue';

const menu = ref(null);
const toast = useToast();

const items = ref([
  {
    label: 'Refresh',
    icon: 'pi pi-refresh',
    command: () => {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
    }
  },
  {
    label: 'Search',
    icon: 'pi pi-search',
    command: () => {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
    }
  },
  {
    separator: true
  },
  {
    label: 'Delete',
    icon: 'pi pi-times',
    command: () => {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
    }
  }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<style lang="css" scoped>
header {
  display: flex;
  flex-direction: row-reverse;
}
</style>
