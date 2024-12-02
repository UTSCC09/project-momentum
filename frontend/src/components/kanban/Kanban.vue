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
      <div class="project-tasks">
        <KanbanTaskGroup :projectId="'NONE'" />
      </div>
    </Panel>

    <Panel style="margin: 1rem 0;" v-for="project in projects" toggleable>
      <template #header>
        <span class="project-header">{{ project.name }}</span>
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

onBeforeMount(() => {
  client.projects.getProjectbyLead.query({ uid: authStore.user })
    .then((res) => {
      const projectsLead = res.projects;
      client.projects.getProjectbyParticipant.query({ uid: authStore.user })
      .then((res) => {
        const projectsParticipate = res.projects;
        projects.value = projectsLead.concat(projectsParticipate);
      })
    })
    .catch((err) => {
      console.error(err);
      toast.add({ severity: 'error', summary: 'Failed to retrieve projects.', life: 3000 });
    });
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
