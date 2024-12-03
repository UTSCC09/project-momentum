<template>
  <Toast />

  <div class="progress">
    <ProgressBar :value="progress" />
  </div>

  <div class="kanban-board">
    <div class="kanban-task-group-container">
      <div class="kanban-task-group-header">To do</div>
      <draggable class="kanban-task-group" :list="todoTasks" group="tasks" @change="updateTodo" itemKey="id"
        draggable=".item">
        <template #item="{ element, index }">
          <KanbanTaskCard v-if="element.uid == user" class="item" :task="element" @delete="deleteTodoTask" />
          <KanbanTaskCard v-else :task="element" @delete="deleteTodoTask" />
        </template>
      </draggable>
    </div>

    <div class="kanban-task-group-container">
      <div class="kanban-task-group-header">In progress</div>
      <draggable class="kanban-task-group" :list="inProgressTasks" group="tasks" @change="udpateInProgress" itemKey="id"
        draggable=".item">
        <template #item="{ element, index }">
          <KanbanTaskCard v-if="element.uid == user" class="item" :task="element" @delete="deleteInProgressTask" />
          <KanbanTaskCard v-else :task="element" @delete="deleteInProgressTask" />
        </template>
      </draggable>
    </div>

    <div class="kanban-task-group-container">
      <div class="kanban-task-group-header">Done</div>
      <draggable class="kanban-task-group" :list="doneTasks" group="tasks" @change="updateDone" itemKey="id"
        draggable=".item">
        <template #item="{ element, index }">
          <KanbanTaskCard v-if="element.uid == user" class="item" :task="element" @delete="deleteDoneTask" />
          <KanbanTaskCard v-else :task="element" @delete="deleteDoneTask" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { client } from "../../api/index";
import { useAuthStore } from "../../stores/auth.store.ts";
import moment from "moment-timezone";
import draggable from "vuedraggable";
import ProgressBar from "primevue/progressbar";
import KanbanTaskCard from "./KanbanTaskCard.vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const authStore = useAuthStore();
const user = authStore.user;

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const todoTasks = ref([]);
const inProgressTasks = ref([]);
const doneTasks = ref([]);
const progress = ref<number>(0);

onBeforeMount(() => {
  client.tasks.getTaskbyProject
    .query({ projectId: props.projectId })
    .then((res) => {
      let total = 0;
      let done = 0;

      for (const task of res.task) {
        total += 1;
        if (task.progress == "not started") {
          todoTasks.value.push(
            Object.assign(
              task,
              task.deadline && {
                deadline: moment
                  .utc(task.deadline)
                  .local()
                  .format("YYYY-MM-DD HH:mm"),
              },
            ),
          );
        } else if (task.progress == "in progress") {
          inProgressTasks.value.push(
            Object.assign(
              task,
              task.deadline && {
                deadline: moment
                  .utc(task.deadline)
                  .local()
                  .format("YYYY-MM-DD HH:mm"),
              },
            ),
          );
        } else {
          done += 1;
          doneTasks.value.push(
            Object.assign(
              task,
              task.deadline && {
                deadline: moment
                  .utc(task.deadline)
                  .local()
                  .format("YYYY-MM-DD HH:mm"),
              },
            ),
          );
        }
      }
      progress.value = total > 0 ? Math.round((done / total) * 100) : 0;
    })
    .catch((err) => {
      toast.add({
        severity: "error",
        summary: `Failed to get tasks.`,
        detail: err.message,
        life: 3000,
      });
    });
});

function updateTodo(event) {
  if (event.added) {
    client.tasks.updateTask
      .mutate({
        taskId: event.added.element.id,
        progress: "not started",
      })
      .then((res) => {
        updateProgress();
      })
      .catch((err) => {
        toast.add({
          severity: "error",
          summary: `Failed to update task.`,
          detail: err.message,
          life: 3000,
        });
      });
  }
}

function udpateInProgress(event) {
  if (event.added) {
    client.tasks.updateTask
      .mutate({
        taskId: event.added.element.id,
        progress: "in progress",
      })
      .then((res) => {
        updateProgress();
      })
      .catch((err) => {
        toast.add({
          severity: "error",
          summary: `Failed to update task.`,
          detail: err.message,
          life: 3000,
        });
      });
  }
}

function updateDone(event) {
  if (event.added) {
    client.tasks.updateTask
      .mutate({
        taskId: event.added.element.id,
        progress: "completed",
      })
      .then((res) => {
        updateProgress();
      })
      .catch((err) => {
        toast.add({
          severity: "error",
          summary: `Failed to update task.`,
          detail: err.message,
          life: 3000,
        });
      });
  }
}

function updateProgress() {
  const total =
    todoTasks.value.length +
    inProgressTasks.value.length +
    doneTasks.value.length;
  progress.value =
    total > 0 ? Math.round((doneTasks.value.length / total) * 100) : 0;
}

function deleteTodoTask(taskId) {
  todoTasks.value = todoTasks.value.filter((task) => task.id != taskId);
}

function deleteInProgressTask(taskId) {
  inProgressTasks.value = inProgressTasks.value.filter(
    (task) => task.id != taskId,
  );
}

function deleteDoneTask(taskId) {
  doneTasks.value = doneTasks.value.filter((task) => task.id != taskId);
}
</script>

<style lang="css" scoped>
.kanban-board {
  display: grid;
  column-gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
}

.kanban-task-group-container {
  background-color: var(--p-primary-100);
  padding: 1rem;
  border-radius: var(--p-border-radius-md);
}

.kanban-task-group-header {
  font-size: var(--p-card-title-font-size);
  font-weight: var(--p-card-title-font-weight);
  margin-bottom: 1rem;
}

.progress {
  margin-bottom: 1rem;
}
</style>
