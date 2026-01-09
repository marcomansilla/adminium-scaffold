import { ref } from 'vue';
import {
  required,
  email,
  minLength,
  sameAs,
  requiredIf,
} from '../composables/rules.js';

export const ciaModel = ref({
  name: '',
  address:'',
  phone:'',
  email: '',
  contact: '',
  website: '',
});

export const ciaFormRules = {
  name: [required, minLength(6)],
  address: [required],
  phone: [required],
  email: [required, email],
};

export const ciaFormFields = [
  {
    name: 'name',
    label: 'Nombre de la compañia',
    type: 'text',
  },
  {
    name: 'address',
    label: 'Direccion',
    type: 'text',
  },
  {
    name: 'phone',
    label: 'Telefono',
    type: 'text',
  },
  {
    name: 'email',
    label: 'E-mail',
    type: 'text',
  },
  {
    name: 'contact',
    label: 'Contacto',
    type: 'text',
  },
  {
    name: 'website',
    label: 'Sitio web',
    type: 'text',
  }
];
