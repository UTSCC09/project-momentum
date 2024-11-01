<template>
  <div class="kanban-board">
    <div>
      <h3>To do</h3>
      <draggable
        class="kanban-task-group"
        :list="list1"
        group="tasks"
        @change="log"
        itemKey="id"
      >
        <template #item="{ element, index }">
          <KanbanTaskCard :task="element" />
        </template>
      </draggable>
    </div>

    <div>
      <h3>In progress</h3>
      <draggable
        class="kanban-task-group"
        :list="list2"
        group="tasks"
        @change="log"
        itemKey="id"
      >
        <template #item="{ element, index }">
          <KanbanTaskCard :task="element" />
        </template>
      </draggable>
    </div>

    <div>
      <h3>Done</h3>
      <draggable
        class="kanban-task-group"
        :list="list3"
        group="tasks"
        @change="log"
        itemKey="id"
      >
        <template #item="{ element, index }">
          <KanbanTaskCard :task="element" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import KanbanTaskCard from "./KanbanTaskCard.vue";

export default {
  order: 1,
  components: {
    draggable,
    KanbanTaskCard,
  },
  data() {
    return {
      list1: [
        { title: "Task 1", id: 1, date: "Sep 25" },
        { title: "Task 2", id: 2, date: "Sep 27" },
        { title: "Task 3", id: 3, date: "Oct 30" },
        { title: "Task 4", id: 4, date: "Oct 30" }
      ],
      list2: [
        { title: "Task 5", id: 5, date: "Oct 30" },
        { title: "Task 6", id: 6, date: "Oct 30" },
        { title: "Task 7", id: 7, date: "Oct 30" }
      ],
      list3: [
        { title: "Task 8", id: 8, date: "Oct 30" },
        { title: "Task 9", id: 9, date: "Oct 30" },
        { title: "Task 10", id: 10, date: "Oct 30" }
      ]
    };
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan" });
    },
    replace: function() {
      this.list = [{ name: "Edgard" }];
    },
    clone: function(el) {
      return {
        name: el.name + " cloned"
      };
    },
    log: function(evt) {
      window.console.log(evt);
    }
  }
};
</script>

<style lang="css" scoped>
.kanban-board {
  display: flex;
  gap: 20px;
}

.kanban-task-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>