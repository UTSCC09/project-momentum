import { defineStore } from 'pinia';
import { client } from '../api/index';
import { ref } from 'vue';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: localStorage.getItem('user'),
  }),
  actions: {
    login(id) {
      // update pinia state
      this.user = id;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', this.user);
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    }
  }
});