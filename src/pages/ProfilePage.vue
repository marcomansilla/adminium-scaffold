<template lang="pug">
.q-pa-md
  .row.justify-center
    .col-sm-8.col-md-6
      q-card
        q-card-section
          .text-h6.text-center Perfil de usuario
          .text-subtitle2.text-center.text-grey Puede actualizar sus datos

        q-card-section
          q-form(@submit="onSubmit")
            q-input(
              v-model="form.fullname"
              label="Nombre completo"
              lazy-rules
              :rules="[val => !!val || 'Nombre completo es requerido']"
            )

            q-input(
              v-model="form.email"
              label="E-mail"
              type="email"
              lazy-rules
              disable
              :rules="[val => !!val || 'E-mail es requerido']"
            )

            q-input(
              v-model="form.phone"
              label="Telefono"
              type="tel"
              lazy-rules
              :rules="[val => !!val || 'No puede estar vacio']"
            )

            q-input(
              v-model="form.dni"
              label="DNI *"
              lazy-rules
              :rules="[val => !!val || 'No puede estar vacio']"
            )

            q-input(
              v-model="form.cuit"
              label="CUIT *"
              lazy-rules
              :rules="[val => !!val || 'No puede estar vacio']"
            )

            q-input(
              v-model="form.address"
              label="Direccion"
              lazy-rules
              :rules="[val => !!val || 'No puede estar vacio']"
            )

            q-input(
              v-model="form.city"
              label="Ciudad"
              lazy-rules
              :rules="[val => !!val || 'No puede estar vacio']"
            )

            q-input(
              v-model="form.birthday"
              label="Fecha de nacimiento"
              type="date"
            )

            q-input(
              v-model="form.matricula"
              label="Matricula"
            )

            q-btn(
              type="submit"
              label="Actualizar informacion"
              color="primary"
              class="full-width q-mt-md"
              :loading="saving"
            )

            q-separator
            q-btn.q-mt-xl(
              size="lg"
              color="blue"
              icon="fab fa-google"
              label="Asociar a mi cuenta Google"
              outline
              class="full-width")
</template>

<script setup>
 import { ref, onMounted } from 'vue';
 import { useRouter } from 'vue-router';
 import { useQuasar, LocalStorage } from 'quasar';
 import { useRequests } from '../composables/requestor';
 import { GlobalNotificator } from '../composables/notificator.js';

 const router = useRouter();
 const $q = useQuasar();
 const saving = ref(false);
 const { createRecord } = useRequests();
 const form = ref({
   fullname: '',
   email: '',
   phone: '',
   dni: '',
   cuit: '',
   address: '',
   city: '',
   birthday: '',
   matricula: ''
 })

 const onSubmit = async () => {
   console.log('subitting')
   saving.value = true
   console.log(form.value, form)
   try {
     const response = await createRecord('users', 'auth/register/complete', form.value, true)
     console.log(response)
     const user = {}
     //window.localStorage.setItem('profile', user)
     GlobalNotificator('Se ha actualizado el perfil.', 'positive');
     router.push('/')
   } catch (error) {
     console.log(error)
     GlobalNotificator('Ha ocurrido un problema con su solicitud, intente nuevamente.', 'danger')
   } finally {
     saving.value = false
   }
 }

 onMounted(() => {
   Object.assign(form.value, JSON.parse(window.localStorage.getItem('profile')))
 })
</script>
