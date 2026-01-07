import { defineStore } from 'pinia';
import { GlobalNotificator } from '../composables/notificator.js';
import axios from 'axios';

export const useRequestStore = defineStore('requests', {
  state: () => ({
    BASE_URL: import.meta.env.VITE_BASE_API,
    modules: {},
  }),

  actions: {
    initializeModule(name) {
      this.modules[name] = {
	data: [],
	pagination: {},
      };
    },
    async getAllData(module, uri, payload = null) {
      let params = {};
      if (payload) {
	params = { params: payload };
      } else {
	params = { params: this.modules[module].pagination };
      }
      await axios
	.get(`${this.BASE_URL}/${uri}`, params)
	.then((res) => {
	  this.modules[module].data = res.data.data;
	  this.modules[module].pagination = res.data.pagination;
	})
	.catch((err) => {
	  console.log(err);
	});
    },
    async createRecord(module, uri, payload) {
      let response = {};
      try {
	const res = await axios.post(`${this.BASE_URL}/${uri}`, payload);
	if ([200, 201, 204].includes(res.status)) {
	  response = res;
	} else {
	  response = error.response;
	}
      } catch (error) {
	response.data = error.response.data;
      }
      return response;
    },
    async updateRecord(module, uri, payload) {
      console.log(payload);
      let response = {};
      try {
	const res = await axios.put(`${this.BASE_URL}/${uri}`, payload);
	if ([200, 201, 204].includes(res.status)) {
	  response = res;
	} else {
	  GlobalNotificator(
	    'Ha ocurrido un error, por favor revise los datos!.',
	    'negative',
	  );
	}
      } catch (error) {
	response.data = error.response;
      }
      return response.data;
    },
    async deleteRecord(module, payload) {
      let response = {};
      await axios
	.delete(`${this.BASE_URL}/delete/${module}`, {
	  data: payload,
	})
	.then((res) => {
	  response = res;
	})
	.catch((err) => {
	  response.data = error.response.data;
	});
      return response.data;
    },
  },
});
