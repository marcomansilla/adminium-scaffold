import { ref } from 'vue';
import {
  required,
  email,
  minLength,
  sameAs,
  requiredIf,
} from '../composables/rules.js';

export const userModel = ref({
  fullname: '',
  email: '',
  matricula: '',
  address:'',
  dni: '',
  cuix: '',
  phone: '',
  birthday: '',
  has_login: false
});

export const userFormRules = {
  fullname: [required, minLength(6)],
  email: [required, email],
};

export const userFormFields = [
  {
    name: 'fullname',
    label: 'Apellido/s y Nombre/s',
    type: 'text',
  },
  {
    name: 'email',
    label: 'E-mail',
    type: 'text',
  },
  {
    name: 'matricula',
    label: 'Matricula',
    type: 'text',
  },
  {
    name: 'dni',
    label: 'DNI',
    type: 'text',
  },
    {
    name: 'cuix',
    label: 'CUIT',
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
    name: 'birthday',
    label: 'Fecha de nacimiento',
    type: 'date',
  },
  {
    name: 'has_login',
    label: 'Tiene login',
    type: 'switch',
  }
];
