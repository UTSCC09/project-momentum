<template>
  <div class="progress">
    <ProgressBar :value="progress" />
  </div>

  <div class="kanban-board">
    <div class="kanban-task-group-container">
      <div class="kanban-task-group-header">To do</div>
      <draggable class="kanban-task-group" :list="todoTasks" group="tasks" @change="log" itemKey="id">
        <template #item="{ element, index }">
          <KanbanTaskCard :task="element" />
        </template>
      </draggable>
    </div>

    <div class="kanban-task-group-container">
      <div class="kanban-task-group-header">In progress</div>
      <draggable class="kanban-task-group" :list="inProgressTasks" group="tasks" @change="log" itemKey="id">
        <template #item="{ element, index }">
          <KanbanTaskCard :task="element" />
        </template>
      </draggable>
    </div>

    <div class="kanban-task-group-container">
      <div class="kanban-task-group-header">Done</div>
      <draggable class="kanban-task-group" :list="doneTasks" group="tasks" @change="log" itemKey="id">
        <template #item="{ element, index }">
          <KanbanTaskCard :task="element" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { client } from '../../api/index';
import moment from 'moment-timezone';
import draggable from "vuedraggable";
import ProgressBar from 'primevue/progressbar';
import KanbanTaskCard from "./KanbanTaskCard.vue";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const todoTasks = ref([]);
const inProgressTasks = ref([]);
const doneTasks = ref([]);
const progress = ref<number>(50);

onBeforeMount(() => {
  let total = 0;
  let done = 0;

  client.tasks.getTaskbyProject.query({ projectId: props.projectId })
    .then((res) => {
      console.log(res);

      for (const task of res.task) {
        total += 1;
        const taskItem = {
          title: task.name,
          id: task.id,
          date: moment.utc(task.deadline).local().format("YYYY-MM-DD HH:mm"),
          description: task.description,
        };

        if (task.progress) {
          inProgressTasks.value.push(taskItem);
        }
        else {
          done += 1;
          doneTasks.value.push(taskItem);
        }
      }

      progress.value = done / total;
    })
    .catch((err) => {
      console.log(err);
    });
})

function log(evt) {
  console.log(evt);
}

// export default {
//   components: {
//     draggable,
//     KanbanTaskCard,
//   },
//   data() {
//     return {
//       list1: [
//         { title: "Task 1", id: 1, date: "Sep 25" },
//         { title: "Task 2", id: 2, date: "Sep 27" },
//         { title: "Task 3", id: 3, date: "Oct 30" },
//         { title: "Task 4", id: 4, date: "Oct 30" }
//       ],
//       list2: [
//         { title: "Task 5", id: 5, date: "Oct 30" },
//         { title: "Task 6", id: 6, date: "Oct 30" },
//         { title: "Task 7", id: 7, date: "Oct 30" }
//       ],
//       list3: [
//         { title: "Task 8", id: 8, date: "Oct 30" },
//         { title: "Task 9", id: 9, date: "Oct 30" },
//         { title: "Task 10", id: 10, date: "Oct 30" }
//       ]
//     };
//   },
//   methods: {
//     add: function () {
//       this.list.push({ name: "Juan" });
//     },
//     replace: function () {
//       this.list = [{ name: "Edgard" }];
//     },
//     clone: function (el) {
//       return {
//         name: el.name + " cloned"
//       };
//     },
//     log: function (evt) {
//       window.console.log(evt);
//     }
//   }
// };
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