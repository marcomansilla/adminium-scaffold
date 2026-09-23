<template lang="pug">
    q-page(class="flex flex-center")
      .row.form
        .col-12
          h1.text-h3.center.text-white.text-bold Ingreso
        .col-12
          form
            q-input(label="E-mail" placeholder="email@host.com" v-model="credentials.email")
              template(v-slot:prepend)
                q-icon(name="person")
            q-input(label="Contraseña" type="password" v-model="credentials.password")
              template(v-slot:prepend)
                q-icon(name="key")
            q-btn.q-mt-xl.full-width(
              icon="login"
              size="lg"
              color="primary"
              @click="login") &nbsp&nbsp Ingresar
            .text-center.q-mb-sm Or continue with
            q-btn(
              size="lg"
              color="blue"
              icon="fab fa-google"
              label="Continuar con Google"
              outline
              class="full-width"
              @click="googleLogin"
            )
            .row
              .col-6
              .col-6.q-pt-lg(style="text-align: right")
                p.text-h6.text-white Necesitas ayuda?
</template>

<script setup>
 import { ref } from 'vue';
 import { useRouter } from 'vue-router';
 import { useAuth } from '../composables/auth.js';
 import { GlobalNotificator } from '../composables/notificator.js';

 const router = useRouter();
 const { loginUser, googleLogin } = useAuth();
 const credentials = ref({
   email: '',
   password:''
 })

 const login = async () => {
   const res = await loginUser('auth/login', credentials.value);
   if (res.status == 200) {
     GlobalNotificator('Sesion iniciada', 'positive');
     router.push('/')
   }
   console.log(res)
 }

</script>

<style lang="scss">
 .form {
   margin-top: 1rem;
   min-width: 550px;
   background-color: rgba(0,0,0,.6);
   padding: 4rem 3rem 2rem 3rem;
   .q-field {
     &__label {
       color: #fff;
     }
     &__native {
       color: #fff;
       font-size: 1.5rem;
     }
     .q-icon {
       color: #fff;
     }

   }
 }
</style>
