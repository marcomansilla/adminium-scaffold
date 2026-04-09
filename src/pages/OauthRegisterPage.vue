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
              label="Terminar registro"
              color="primary"
              class="full-width q-mt-md"
              :loading="saving"
            )
</template>

<script setup>
 import { ref, onMounted } from 'vue'
 import { useRouter } from 'vue-router'
 import { useQuasar, LocalStorage } from 'quasar'
 import { api } from 'src/boot/axios'

 const router = useRouter()
 const $q = useQuasar()
 const saving = ref(false)

 const form = ref({
   fullname: '',
   phone: '',
   dni: '',
   cuit: '',
   address: '',
   city: '',
   birthday: '',
   matricula: ''
 })

 const onSubmit = async () => {
   saving.value = true

   try {
     const response = await api.post('/auth/register/complete', form)
     const user = response.data.user

     LocalStorage.set('user', user)

     $q.notify({
       type: 'positive',
       message: 'Registration completed successfully!'
     })

     router.push('/dashboard')
   } catch (error) {
     $q.notify({
       type: 'negative',
       message: error.response?.data?.message || 'Failed to complete registration'
     })
   } finally {
     saving.value = false
   }
 }

 onMounted(() => {
   form.value = JSON.parse(window.localStorage.getItem('profile'));
 })
</script>
