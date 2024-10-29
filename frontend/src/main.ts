import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';

// primevue
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

// stylesheet, order is important!
import '@schedule-x/theme-default/dist/index.css'
import './style.css'

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue, {
  theme: {
    preset: Aura
  },
  ripple: true,
});
app.mount('#app');
