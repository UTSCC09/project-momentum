import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';

// primevue
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';

// components
import Calendar from './components/calendar/Calendar.vue';
import Kanban from './components/kanban/Kanban.vue';

// stylesheet, order is important!
import '@schedule-x/theme-default/dist/index.css';
import './colors.css';
import './style.css';
import 'primeicons/primeicons.css'

const routes = [
  { path: '/', component: Calendar },
  { path: '/tasks', component: Kanban },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  },
  ripple: true,
});
app.mount('#app');
