<template lang="pug">
q-page.q-pa-md
  h3 Usuarios
  q-input.full-width(label="Filtrar" v-model="filter_text" )
    q-icon(name="filter_alt" size="lg")
  br
  br
  q-table(
    v-model:pagination="pagination"
    :filter="filter_text"
    @request="(props) => onRequest(props, 'users', 'users/admin/users', filter_text, filter_fields)"
    title="Usuarios"
    :columns="columns"
    :rows="users")
    template(v-slot:body-cell-open="props")
      q-td(:props="props")
        q-btn(icon="remove_red_eye" color="primary" round size="sm" @click="openUserDialog(props.row)")
    template(v-slot:body-cell-delete="props")
      q-td(:props="props")
        q-btn(icon="delete" color="red" round size="sm")
  q-btn.add-btn(icon="add" round size="xl" @click="openUserDialog()")


  q-dialog(v-model="open_dialog" backdrop-filter="blur(4px)")
    q-card(style="width: 700px; max-width: 80vw")
      q-card-section.row.items-center.q-pb-none.text-h6.bg-primary.text-white {{user.id ? 'Actualizar datos' : 'Nuevo usuario'}}
      q-card-section
        form-builder-component(
          :fields="userFormFields"
          v-model="user"
          formname="users"
          :rules="userFormRules"
          :extraBtn="{text: 'Cancelar', color:'red', display:true}"
          :actionSubmit="handleUser")


</template>

<script setup>
 import { useQuasar } from 'quasar';
 import { ref, onMounted, computed } from 'vue';
 import { useUsersStore } from 'stores/users.js';
 import { useRequests } from '../composables/requestor';
 import FormBuilderComponent from '../components/FormBuilderComponent.vue';
 import { userModel, userFormRules, userFormFields } from '../models/user.js';


 // Required variables
 const { getAllData, deleteRecord, createRecord, updateRecord, modules, onRequest } = useRequests();
 const filter_text = ref('');
 const filter_fields = 'fullname, dni, email, matricula'
 const users = computed(() => modules.users?.data);
 const pagination = computed(() => modules.users?.pagination);
 const open_dialog = ref(false)
 const user = ref({});

 const columns = [
   { name: 'fullname', align: 'left', label: 'Nombre completo', field: 'fullname', sortable: true },
   { name: 'email', align: 'left',label: 'E-mail', field: 'email', sortable: false },
   { name: 'matricula', align: 'left',label: 'Matricula', field: 'matricula', sortable: false },
   { name: 'cuit', align: 'left',label: 'CUIT', field: 'cuit', sortable: false },
   { name: 'phone', align: 'left',label: 'Telefono', field: 'phone', sortable: false },
   { name: 'open', align: 'left',label: 'Ver', sortable: false },
   { name: 'delete', align: 'left',label: 'Eliminar', sortable: false },
 ]
 const handleUser = () => {
   console.log(userModel.value)
 }

 const openUserDialog = (data=null) => {
   if (data) {
     user.value = data;
     open_dialog.value = true;
   } else {
     resetUser();
     open_dialog.value = false;
   }
   open_dialog.value = true
 }

 const resetUser = () => {
   user.value = userModel.value
 }
 onMounted(() => {
   getAllData('users', 'users/admin/users')
   user.value = userModel.value
 })
</script>

<style lang="scss">

</style>
