<template>
  <header class="sx__calendar-header">
    <UserMenu view="Tasks" />
  </header>
  <div class="card">
    <Toast />

    <Panel style="margin: 1rem 0;" toggleable>
      <template #header>
        <span class="project-header">Uncategorized</span>
      </template>
      <template #icons>
        <Button icon="pi pi-cog" severity="secondary" rounded text @click="toggle" />
        <Menu id="config_menu" :model="items" popup />
      </template>
      <div class="project-tasks">
        <KanbanTaskGroup :projectId="'NONE'" />
      </div>
    </Panel>

    <Panel style="margin: 1rem 0;" v-for="project in projects" toggleable>
      <template #header>
        <span class="project-header">{{ project.name }}</span>
      </template>
      <template #icons>
        <Button icon="pi pi-cog" severity="secondary" rounded text @click="toggle" />
        <Menu id="config_menu" :model="items" popup />
      </template>
      <div class="project-tasks">
        <KanbanTaskGroup :projectId="project.id" />
      </div>
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { client } from '../../api/index';
import { useAuthStore } from '../../stores/auth.store.ts';

import { useToast } from "primevue/usetoast";
import Menu from 'primevue/menu';
import Panel from 'primevue/panel';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import UserMenu from '../calendar/UserMenu.vue';
import KanbanTaskGroup from './KanbanTaskGroup.vue';

const authStore = useAuthStore();

const toast = useToast();

const projects = ref([]);
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

onBeforeMount(() => {
  client.projects.getProjectbyLead.query({ uid: authStore.user })
    .then((res) => {
      for (const project of res.projects) {
        projects.value.push(project);
      }
    })
    .catch((err) => {
      console.error(err);
    })
})
</script>

<style lang="css" scoped>
header {
  display: flex;
  flex-direction: row-reverse;
}

.project-header {
  font-size: var(--sx-font-extra-large);
  font-weight: 600;
}
</style>
