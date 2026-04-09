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
 import { api } from 'src/boot/axios'

 const router = useRouter()
 const route = useRoute()
 const $q = useQuasar()
 const loading = ref(true)
 const error = ref('')

 onMounted(async () => {
   const token = route.query.token
   const requiresCompletion = route.query.requires_completion === 'true'

   if (token) {
     // Clean token if needed
     let cleanToken = token

     window.localStorage.setItem('token', token)
     window.localStorage.setItem('isLoggedIn', true);
     try {
       const response = await api.get(`${import.meta.env.VITE_BASE_API}/auth/profile`)
       const user = response.data
       window.localStorage.setItem('profile', JSON.stringify(user))
       if (requiresCompletion || user.requires_completion) {
         router.push('auth/register/complete')
       } else {
         $q.notify({ type: 'positive', message: `Welcome ${profile.fullname}!` })
         router.push('/')
       }
     } catch (err) {
       error.value = 'Failed to get user info'
       loading.value = false
     }
   } else {
     error.value = 'No token received'
     loading.value = false
   }
 })

 const goToLogin = () => {
   router.push('/login')
 }
</script>
