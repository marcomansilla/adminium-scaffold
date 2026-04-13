<!-- src/pages/OAuthCallback.vue -->
<template lang="pug">
.flex.flex-center.full-height
  div(v-if="loading")
    q-spinner(size="3rem" color="primary")
    p Completing sign in...

  div(v-else-if="error")
    q-icon(name="error" color="negative" size="3rem")
    p {{ error }}
    q-btn(color="primary" @click="goToLogin") Return to Login
</template>

<script setup>
 import { ref, onMounted } from 'vue'
 import { useRouter, useRoute } from 'vue-router'
 import { useQuasar } from 'quasar'
 import { GlobalNotificator } from '../composables/notificator'
 import { useRequests } from '../composables/requestor'
 import { useAuth } from '../composables/auth';

 const router = useRouter()
 const route = useRoute()
 const $q = useQuasar()
 const loading = ref(true)
 const error = ref('')
 const { oauthSet } = useAuth()
 const { getModuleData, modules } = useRequests()

 onMounted(async () => {
   console.log(route)
   const token = route.query.token
   const requiresCompletion = route.query.requires_completion === 'true'

   if (!token) {
     error.value = 'No se ha recibido el token'
     loading.value = false
     return
   }
   oauthSet(token);
   try {
     window.localStorage.setItem('token', token)
     window.localStorage.setItem('isLoggedIn', 'true')
     await getModuleData('auth', 'auth/profile', 'profile', true)
     const user = modules?.auth?.profile
     if (!user) {
       throw new Error('No se pudo obtener el perfil')
     }
     window.localStorage.setItem('profile', JSON.stringify(user))
     const needsCompletion = requiresCompletion || user.requires_completion === true
     if (needsCompletion) {
       router.push('/auth/register/complete')
     } else {
       GlobalNotificator(`Bienvenido ${user.fullname || user.email}`, 'positive')
       router.push('/')
     }
   } catch (err) {
     error.value = 'No se puede cargar la informacion del perfil'
     loading.value = false
     window.localStorage.removeItem('token')
     window.localStorage.removeItem('isLoggedIn')
   }
 })

 const goToLogin = () => {
   router.push('/login')
 }
</script>
