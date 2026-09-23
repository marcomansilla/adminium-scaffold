<template lang="pug">
q-page
  br
  br
  br
  br
  br
  br
  br
  br
  br
  br
  br
  br
  .inline-block.text-h2 Bienvenido
  .inline-block.text-h5 {{profile.fullname}}
</template>

<script setup>
 import { onMounted, ref } from 'vue';

 const profile = ref({});

 onMounted(async () => {
   profile.value = JSON.parse(window.localStorage.getItem('profile'))
 })
</script>
