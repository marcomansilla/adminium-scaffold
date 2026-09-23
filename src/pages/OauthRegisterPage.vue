<template lang="pug">
.q-pa-md
  .row.justify-center
    .col-sm-8.col-md-6
      q-card
        q-card-section
          .text-h6.text-center Complete su registro
          .text-subtitle2.text-center.text-grey Por favor agregue la informacion solicitada.

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
              label="Terminar registro"
              color="primary"
              class="full-width q-mt-md"
              :loading="saving"
            )
</template>

<!-- src/pages/OauthRegisterPage.vue -->
<script setup>
 import { ref, onMounted } from 'vue'
 import { useRouter } from 'vue-router'
 import { useQuasar } from 'quasar'
 import { useRequests } from '../composables/requestor'
 import { GlobalNotificator } from '../composables/notificator'

 const router = useRouter()
 const $q = useQuasar()
 const saving = ref(false)
 const { createRecord } = useRequests()

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
   saving.value = true

   try {
     const response = await createRecord('users', 'gauth/register/complete', form.value, true)
     console.log('Response:', response)

     // Fix: Check different response structures
     const user = response?.data?.user || response?.user || response?.data

     if (!user) {
       throw new Error('No user data received')
     }

     // Update stored profile with complete data
     window.localStorage.setItem('profile', JSON.stringify(user))

     GlobalNotificator('Registro completado exitosamente', 'positive')
     router.push('/')
   } catch (error) {
     console.error('Complete registration error:', error)
     const message = error.response?.data?.message || error.message || 'Failed to complete registration'
     GlobalNotificator(message, 'negative')
   } finally {
     saving.value = false
   }
 }

 onMounted(() => {
   // Get existing profile data from localStorage
   const profile = window.localStorage.getItem('profile')
   if (profile) {
     const userData = JSON.parse(profile)
     form.value.id = userData.id || ''
     form.value.fullname = userData.fullname || ''
     form.value.email = userData.email || ''
     form.value.phone = userData.phone || ''
     form.value.dni = userData.dni || ''
     form.value.cuix = userData.cuix || ''
     form.value.address = userData.address || ''
     form.value.city = userData.city || ''
     form.value.birthday = userData.birthday || ''
     form.value.matricula = userData.matricula || ''
   }
 })
</script>
