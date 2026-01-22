import { ref, computed } from 'vue';

import { useRequestStore } from '../stores/UseRequestStore.js';

import {
  required,
  email,
  minLength,
  sameAs,
  requiredIf,
} from '../composables/rules.js';

const store = useRequestStore();

export const eventModel = ref({
  cia_id: '',
  date:'',
  time: '',
  message:''
});

export const eventFormRules = {
  cia_id: [required],
  date: [required],
  time: [required],
  mesasage: [required, minLength(20)],
};

export const eventFormFields = computed(() => [
  {
    name: 'cia_id',
    label: 'Compañia',
    type: 'select',
    options: store.modules.events?.cias || []
  },
  {
    name: 'date',
    label: 'Fecha',
    type: 'date',
  },
  {
    name: 'time',
    label: 'Hora',
    type: 'time',
  },
  {
    name: 'message',
    label: 'Mensaje',
    type: 'richtext',
  }
]);
