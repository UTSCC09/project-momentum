<template>
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
      This will have my kanban board.
    </Panel>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from "primevue/usetoast";
import Menu from 'primevue/menu';
import Panel from 'primevue/panel';
import Toast from 'primevue/toast';
import Button from 'primevue/button';

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
