<template lang="pug">
q-page.q-pa-md
  h3 Usuarios
  q-table(
    title="Usuarios"
    :columns="columns"
    :rows="store.users")
    template(v-slot:body-cell-open="props")
      q-td(:props="props")
        q-btn(icon="remove_red_eye" color="primary" round size="sm" @click="openUserDialog(props.row)")
    template(v-slot:body-cell-delete="props")
      q-td(:props="props")
        q-btn(icon="delete" color="red" round size="sm")
  q-btn.add-btn(icon="add" round size="xl" @click="openUserDialog()")

  q-dialog(v-model="enableUserDialog" backdrop-filter="blur(5px)")
    q-card
      q-card-section.row.items-center.q-pb-none.text-h6 {{operation}}
      q-card-section
        p {{user}}
  p {{enableUserDialog}}
</template>

<script setup>
 import { ref, onMounted } from 'vue';
 import { useUsersStore } from 'stores/users.js';
 import { storeToRefs } from 'pinia';
 import DialogComponent from '../components/DialogComponent.vue';
 const user = ref({
   fullname: '',
   email: '',
   matricula: '',
   dni: '',
   cuit: '',
   phone: '',
   birthday: '',
   has_login: false
 })

 const operation = ref('New')
 const enableUserDialog = ref(false)
 const enableEditUserDialog = ref(false)
 const store = useUsersStore();
 const columns = [
   { name: 'fullname', align: 'left', label: 'Nombre completo', field: 'fullname', sortable: true },
   { name: 'email', align: 'left',label: 'E-mail', field: 'email', sortable: false },
   { name: 'matricula', align: 'left',label: 'Matricula', field: 'matricula', sortable: false },
   { name: 'cuit', align: 'left',label: 'CUIT', field: 'cuit', sortable: false },
   { name: 'phone', align: 'left',label: 'Telefono', field: 'phone', sortable: false },
   { name: 'open', align: 'left',label: 'Ver', sortable: false },
   { name: 'delete', align: 'left',label: 'Eliminar', sortable: false },
 ]

 const openUserDialog = (data=null) => {
   if (data) {
     user.value = data;
     delete user.value.deleted_by
     delete user.value.deleted_at
     delete user.value.created_by
     delete user.value.created_at
     delete user.value.updated_at
     delete user.value.updated_by
     enableEditUserDialog.value = true;
     operation.value = "Informacion del usuario"
   } else {
     resetUser();
     enableEditUserDialog.value = false;
     operation.value = "Crear nuevo usuario"
   }
   enableUserDialog.value = true
 }

 const resetUser = () => {
   user.value = {
     fullname: '',
     email: '',
     matricula: '',
     dni: '',
     cuit: '',
     phone: '',
     birthday: '',
     has_login: false
   }
 }
 onMounted(() => {
   store.getUsers();
 })
</script>

<style lang="scss">

</style>
