<template lang="pug">
    q-page(class="flex flex-center")
      .row.form
        .col-12
          h1.text-h3.center.text-white.text-bold Ingreso
        .col-12
          form
            q-input(label="CUIT" placeholder="11-11111111-1")
              template(v-slot:prepend)
                q-icon(name="person")
            q-input(label="Contraseña" type="password")
              template(v-slot:prepend)
                q-icon(name="key")
            q-btn.q-mt-xl.full-width(icon="login" size="lg" color="primary" tag="a" to="/") &nbsp&nbsp Ingresar
            .row
              .col-6
              .col-6.q-pt-lg(style="text-align: right")
                p.text-h6.text-white Necesitas ayuda?
</template>

<script setup>
 //
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