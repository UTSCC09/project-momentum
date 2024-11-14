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
    login(username) {
      // update pinia state
      this.user = username;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', username);
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    }
  }
});