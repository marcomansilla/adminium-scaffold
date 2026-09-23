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
              v-model="form.cuix"
              label="CUIL/CUIT *"
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
              v-if="form.oauth_provider != 'google'"
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
 const { createRecord, getModuleData, modules } = useRequests();
 const form = ref({
   fullname: '',
   email: '',
   phone: '',
   dni: '',
   cuix: '',
   address: '',
   city: '',
   birthday: '',
   matricula: ''
 })

 const onSubmit = async () => {
   console.log('subitting')
   saving.value = true
   try {
     const response = await createRecord('users', 'gauth/register/complete', form.value, true)
     const user = response.data.data.user
     console.log(user)
     window.localStorage.setItem('profile', JSON.stringify(user))
     GlobalNotificator('Se ha actualizado el perfil.', 'positive');
     checkProfile()
   } catch (error) {
     GlobalNotificator('Ha ocurrido un problema con su solicitud, intente nuevamente.', 'danger')
   } finally {
     saving.value = false
   }
 }

 const checkProfile = async() => {
   await getModuleData('auth', 'auth/profile', 'profile', true)
     const user = modules?.auth?.profile
     if (!user) {
       throw new Error('No se pudo obtener el perfil')
     }
   window.localStorage.setItem('profile', JSON.stringify(user))
 }
 onMounted(() => {
   Object.assign(form.value, JSON.parse(window.localStorage.getItem('profile')))
   checkProfile()
 })
</script>
