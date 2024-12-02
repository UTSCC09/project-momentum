<template>
  <Card style="margin: 0.5rem 0;">
    <template #title>{{ task.name }}</template>
    <template #subtitle>{{ task.deadline }}</template>
    <template #content>
      <p>{{ task.description }}</p>
    </template>
    <template #footer>
      <div class="task-controls">
        <Button label="Edit" severity="secondary" outlined class="button" @click="editTask(task)" />
        <Button label="Delete" class="button" @click="deleteTask(task.id)" />

        <Dialog v-model:visible="taskVisible" modal header="Edit Task" :style="{ width: '50vw' }">
          <TaskForm :initialValues="taskInitialValues" @close="taskVisible = false;" />
        </Dialog>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { client } from '../../api/index';
import TaskForm from '../forms/TaskForm.vue';
import { ref } from 'vue';
import moment from 'moment-timezone';

defineProps({
  task: {
    type: Object,
    default: () => { },
  }
});

const emit = defineEmits(['delete']);

const taskVisible = ref(false);
const taskInitialValues = ref({});

function editTask(task) {
  taskInitialValues.value = {
    ...task,
    deadline: moment(task.deadline).local().toDate(),
  };
  taskVisible.value = true;
}

function deleteTask(taskId) {
  client.tasks.deleteTask.mutate({ taskId: taskId })
    .then((res) => {
      emit('delete', taskId);
    })
    .catch((err) => {
      console.error(err);
    })
}
</script>

<style lang="css" scoped>
.button {
  width: 100%;
}

.task-controls {
  display: flex;
  gap: 1rem;
  margin-top: 1px;
}
</style>