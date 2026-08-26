// stores/UseRequestStore.js
import { defineStore } from 'pinia';
import { GlobalNotificator } from '../composables/notificator.js';
import { useInterceptor } from '../composables/interceptor';
import { useAuthStore } from './UseAuthStore';
import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Setup interceptors once
const { setupInterceptors } = useInterceptor();
setupInterceptors(axiosInstance);

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
        errors: null,
        loading: false
      };
    },

    // Helper to set module errors
    setModuleError(module, error) {
      if (this.modules[module]) {
        this.modules[module].errors = error;
      }
    },

    // Helper to clear module errors
    clearModuleErrors(module) {
      if (this.modules[module]) {
        this.modules[module].errors = null;
      }
    },

    async getAllData(module, uri, payload = null, secure = false, customHeaders = {}) {
      if (!this.modules[module]) {
        this.initializeModule(module);
      }

      this.clearModuleErrors(module);
      this.modules[module].loading = true;

      let params = {};
      if (payload) {
        params = { params: payload };
      } else {
        params = { params: this.modules[module].pagination };
      }

      let headers = { ...customHeaders };


      try {
        const res = await axiosInstance.get(`${this.BASE_URL}/${uri}`, {
          headers: headers,
          params: params.params
        });

        if ([200, 201, 204].includes(res.status)) {
          this.modules[module].data = res.data.data;
          this.modules[module].pagination = res.data.pagination;
        }

        return res;

      } catch (error) {
        this.setModuleError(module, error.response?.data?.message || error.message);
        throw error;

      } finally {
        this.modules[module].loading = false;
      }
    },

    async createRecord(module, uri, payload, secure = false) {
      if (!this.modules[module]) {
        this.initializeModule(module);
      }

      this.clearModuleErrors(module);
      this.modules[module].loading = true;

      let response = {};
      let headers = {};
      if (secure) {
        const authStore = useAuthStore();
        headers = authStore.getHeaders;
      }
      try {
        const res = await axiosInstance.post(`${this.BASE_URL}/${uri}`, payload, {
          headers: headers
        });

        if ([200, 201, 204].includes(res.status)) {
          response = res;
        }

        return response;

      } catch (error) {
        this.setModuleError(module, error.response?.data?.message || error.message);
        return error.response?.data || error;

      } finally {
        this.modules[module].loading = false;
      }
    },

    async updateRecord(module, uri, payload, secure = false) {
      if (!this.modules[module]) {
        this.initializeModule(module);
      }

      this.clearModuleErrors(module);
      this.modules[module].loading = true;

      let response = {};
      const data = JSON.parse(JSON.stringify(payload));
      const record_id = data.id;
      delete data.id;

      let headers = {};
      if (secure) {
        const authStore = useAuthStore();
        headers = authStore.getHeaders;
      }

      try {
        const res = await axiosInstance.put(`${this.BASE_URL}/${uri}/${record_id}`, data, {
          headers: headers
        });

        if ([200, 201, 204].includes(res.status)) {
          response = res;
        } else {
          GlobalNotificator(
            'Ha ocurrido un error, por favor revise los datos!',
            'negative',
          );
        }

        return response;

      } catch (error) {
        this.setModuleError(module, error.response?.data?.message || error.message);
        GlobalNotificator(
          error.response?.data?.message || 'Ha ocurrido un error, por favor revise los datos!',
          'negative',
        );
        return error.response?.data || error;

      } finally {
        this.modules[module].loading = false;
      }
    },

    async deleteRecord(module, uri, secure = false) {
      if (!this.modules[module]) {
        this.initializeModule(module);
      }

      this.clearModuleErrors(module);
      this.modules[module].loading = true;

      let headers = {};
      if (secure) {
        const authStore = useAuthStore();
        headers = authStore.getHeaders;
      }

      try {
        const res = await axiosInstance.delete(`${this.BASE_URL}/${uri}`, {
          headers: headers
        });

        return {
          status: res.status,
          data: res.data
        };

      } catch (err) {
        this.setModuleError(module, err.response?.data?.message || err.message);
        return {
          status: err.response?.status ?? 500,
          data: err.response?.data ?? null
        };

      } finally {
        this.modules[module].loading = false;
      }
    },

    async getModuleData(module, uri, field, secure = false) {
      if (!this.modules[module]) {
        this.initializeModule(module);
      }

      this.clearModuleErrors(module);
      this.modules[module].loading = true;

      let response = {};
      let headers = {};
      if (secure) {
        const authStore = useAuthStore();
        headers = {...authStore.getHeaders};
      }
      try {
        const res = await axiosInstance.get(`${this.BASE_URL}/${uri}`, {
          headers: headers
        });

        this.modules[module][field] = res.data.data;
        response = res;

        return response;

      } catch (error) {
        this.setModuleError(module, error.response?.data?.message || error.message);
        return error.response?.data || error;

      } finally {
        this.modules[module].loading = false;
      }
    },

    async requestModuleData(module, uri, field, payload, secure = false) {
      if (!this.modules[module]) {
        this.initializeModule(module);
      }

      this.clearModuleErrors(module);
      this.modules[module][`loading${field}`] = true;

      let response = {};
      let headers = {};
      if (secure) {
        const authStore = useAuthStore();
        headers = {...authStore.getHeaders};
      }
      try {
        const res = await axiosInstance.post(`${this.BASE_URL}/${uri}`, payload, {
          headers: headers
        }, );
        this.modules[module][field] = res.data.data;
        response = res;

        return response;

      } catch (error) {
        this.setModuleError(module, error.response?.data?.message || error.message);
        return error.response?.data || error;

      } finally {
        this.modules[module][`loading${field}`] = false;
      }
    },

    async uploadFile(uri, formdata, secure = false) {
      let response = {};

      let headers = {
        'Content-Type': 'multipart/form-data'
      };

      try {
        const res = await axiosInstance.post(`${this.BASE_URL}/${uri}`, formdata, {
          headers: headers
        });

        if ([200, 201, 204].includes(res.status)) {
          response = res;
        }

        return response;

      } catch (error) {
        return error.response?.data || error;
      }
    }
  },
});
