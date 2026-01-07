import { defineStore } from 'pinia';
import axios from 'axios';


export const useUsersStore = defineStore('myStore', {
  state: () => ({
    users:[],
    BASE_URL: import.meta.env.VITE_BASE_API
  }),

  getters: {
    all_users: (state) => state.users
  },

  actions: {
    async getUsers() {
      await axios.get(`${this.BASE_URL}/users/admin/users`)
	.then(res => {this.users = res.data})
	.catch(err => console.log(err))
    }
  }
  
})

