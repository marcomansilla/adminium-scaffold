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
  subject: '',
  cia_id: '',
  message:'',
  date_sent: '',
  recipients_count: 0
});

export const eventFormRules = {
  subject: [required],
  cia_id: [required],
  message: [required, minLength(20)],
};

export const eventFormFields = computed(() => [
  {
    name: 'subject',
    label: 'Asunto/Titulo',
    type: 'text'
  },
  {
    name: 'cia_id',
    label: 'Compañia',
    type: 'select',
    options: store.modules.events?.cias || []
  },
  {
    name: 'message',
    label: 'Mensaje',
    type: 'richtext',
  }
]);
