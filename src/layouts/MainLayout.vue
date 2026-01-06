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
  q-page-container
    router-view
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Inicio',
    caption: 'Inicio',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Usuarios',
    caption: 'Usuarios del sistema',
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
    title: 'Perfil',
    caption: 'Perfil de usuario',
    icon: 'person',
    link: '/admin/user/profile'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
