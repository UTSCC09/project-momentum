<template>
  <Card style="margin: 0.5rem 0">
    <template #title>{{ name }}</template>
    <template #subtitle>{{ deadline }}</template>
    <template #content>
      <p>{{ description }}</p>
    </template>
    <template #footer>
      <div class="task-controls">
        <Button v-if="editable" label="Edit" severity="secondary" outlined class="button" @click="editTask(task)" />
        <Button v-if="deletable" label="Delete" class="button" @click="deleteTask(task.id)" />

        <Dialog v-model:visible="taskVisible" modal header="Edit Task" :style="{ width: '50vw' }">
          <TaskForm :id="task.id" :initialValues="taskInitialValues" @close="onClose" />
        </Dialog>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { client } from "../../api/index";
import TaskForm from "../forms/TaskForm.vue";
import { ref, onBeforeMount } from "vue";
import moment from "moment-timezone";
import { useAuthStore } from "../../stores/auth.store.ts";

const props = defineProps({
  task: {
    type: Object,
    default: () => { },
  },
});

const name = ref(props.task.name);
const deadline = ref(props.task.deadline);
const description = ref(props.task.description);

const authStore = useAuthStore();

let editable = false;
let deletable = false;

const emit = defineEmits(["delete"]);

const taskVisible = ref(false);
const taskInitialValues = ref({});

function editTask(task) {
  taskInitialValues.value = Object.assign({},
    task.name && { name: task.name },
    task.description && { description: task.description },
    task.location && { location: task.location },
    task.deadline && { deadline: moment(task.deadline).local().toDate() },
  );
  taskVisible.value = true;
}

function deleteTask(taskId) {
  client.tasks.deleteTask
    .mutate({ taskId: taskId })
    .then((res) => {
      emit("delete", taskId);
    })
    .catch((err) => {
      toast.add({
        severity: "error",
        summary: `Failed to delete task.`,
        detail: err.message,
        life: 3000,
      });
    });
}

function onClose(task) {
  taskVisible.value = false;
  name.value = task.name;
  description.value = task.description;
  deadline.value = moment
    .utc(task.deadline)
    .local()
    .format("YYYY-MM-DD HH:mm");
  taskInitialValues.value = Object.assign({},
    task.name && { name: task.name },
    task.description && { description: task.description },
    task.location && { location: task.location },
    task.deadline && { deadline: moment(task.deadline).local().toDate() },
  );
}

onBeforeMount(() => {
  if (props.task.uid == authStore.user) {
    editable = true;
    deletable = true;
  }
});
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
