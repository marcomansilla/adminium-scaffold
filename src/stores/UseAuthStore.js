import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { GlobalNotificator } from '../composables/notificator.js';

import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    BASE_URL: import.meta.env.VITE_BASE_AUTH || import.meta.env.VITE_BASE_API,
    isLoggedIn: false,
    token: '',
    profile:{},
    headers: {},
    router: useRouter()
  }),

  getters: {
    getHeaders: (state) => {
      return {headers: {
        Authorization: `Bearer ${state.token}`
      }};
    }

  },

  actions: {
    Login(uri, payload) {
      GlobalNotificator('Identificando usuario', 'positive');
      var response = {};
      return axios.post(`${this.BASE_URL}/${uri}`, payload)
        .then(res => {
          if ([200, 201, 204].includes(res.status)) {
            this.isLoggedIn = true;
            this.token = res.data.token;
            this.profile = res.data.profile;
            window.localStorage.setItem('token', res.data.token);
            window.localStorage.setItem('profile', JSON.stringify(res.data.profile));
            window.localStorage.setItem('isLoggedIn', true);
            response = res;
          } else {
            response = res;
          }
          return response;
        }).catch(error => {
          response = {
            status: error.status,
            message: JSON.parse(error.request.response).message
          };
          GlobalNotificator(response.message, 'negative');
          return response;
        });
    },
    CheckAuth(success, fail) {
      if (window.localStorage.getItem('isLoggedIn')) {
        this.isLoggedIn = true;
        this.token = window.localStorage.getItem('token');
        this.profile = JSON.parse(window.localStorage.getItem('profile'));
        this.router.push(success);
      } else {
        this.router.push(fail);
        GlobalNotificator('Ingrese sus credenciales', 'positive');
      }
    },
    Logout() {
      window.localStorage.clear();
      this.router.push('/login');
      GlobalNotificator('Se ha cerrado la sesion.', 'positive');
    }
  },
});
