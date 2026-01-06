import { defineStore } from 'pinia';
import axios from 'axios';


export const useUsersStore = defineStore('myStore', {
  state: () => ({
    users:[]
  }),

  getters: {
    all_users: (state) => state.users
  },

  actions: {
    async getUsers() {
      await axios.get('http://localhost:3100/users/admin/users')
	.then(res => {this.users = res.data})
	.catch(err => console.log(err))
    }
  }
  
})

