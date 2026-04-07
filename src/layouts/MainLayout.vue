<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header(elevated="")
    q-toolbar
      q-btn(flat="" dense="" round="" icon="menu" aria-label="Menu" @click="toggleLeftDrawer")
      q-toolbar-title Adminium
      div v {{ $q.version }}
  q-drawer(v-model="leftDrawerOpen" show-if-above="" bordered="")
    q-list
      q-item-label(header="")  Menu principal
      essential-link(v-for="link in linksList" :key="link.title" v-bind="link")
      q-item.q-mt-xl(clickable="" tag="a" @click="closeSession")
        q-item-section(avatar="")
          q-icon(name="logout")
        q-item-section
          q-item-label Salir
          q-item-label(caption="")
            span.text-gray1 Cerrar sesion
  q-page-container
    router-view
</template>

<script setup>
 import { ref, onBeforeMount, onMounted } from 'vue';
 import { useQuasar } from 'quasar';
 import EssentialLink from 'components/EssentialLink.vue';
 import { useValidator } from '../composables/validator';
 import { useRequests } from '../composables/requestor';
 import { useAuth } from '../composables/auth';


 const $q = useQuasar();
 const { checkAuth, logout } = useAuth();
 const { initializeErrors } = useValidator();
 const { initializeModule } = useRequests()

 const linksList = [
   {
     title: 'Inicio',
     caption: 'Inicio',
     icon: 'home',
     link: '/'
   },
   {
     title: 'Productores',
     caption: 'Productores registrados',
     icon: 'people',
     link: '/admin/users'
   },
   {
     title: 'CIAS',
     caption: 'Companias',
     icon: 'business',
     link: '/admin/cias'
   },
   {
     title: 'Eventos',
     caption: 'Notificaciones',
     icon: 'psychology',
     link: '/admin/events'
   },
   {
     title: 'Perfil',
     caption: 'Perfil de usuario',
     icon: 'person',
     link: '/admin/user/profile'
   }
 ]

 const leftDrawerOpen = ref(false)

 const toggleLeftDrawer = () => {
   leftDrawerOpen.value = !leftDrawerOpen.value
 }

 const closeSession = () => {
   $q.dialog({
     title: 'Confirme',
     message: 'Seguro que desea terminar la sesion?',
     cancel: true,
     persistent: true,
   }).onOk(async () => {
     logout();
   });
 }

 onBeforeMount(() => {
   initializeModule('users')
   initializeErrors('users')
   initializeModule('cias')
   initializeErrors('cias')
   initializeModule('events')
   initializeErrors('events')
   checkAuth('/', '/login')
 })

 onMounted(()=> {
 })
</script>
