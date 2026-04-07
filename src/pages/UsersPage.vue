<template lang="pug">
q-page.q-pa-md
  h3 Productores
  q-input.full-width(label="Filtrar" v-model="filter_text" )
    q-icon(name="filter_alt" size="lg")
  br
  br
  q-table(
    v-model:pagination="pagination"
    :filter="filter_text"
    @request="(props) => onRequest(props, 'users', 'users/admin/users', filter_text, filter_fields)"
    title="Productores"
    :columns="columns"
    :rows="users")
    template(v-slot:body-cell-cias_btn="props")
      q-td(:props="props")
        q-btn(icon="business" color="primary" round size="sm" @click="openRelations(props.row)")
    template(v-slot:body-cell-open="props")
      q-td(:props="props")
        q-btn(icon="remove_red_eye" color="primary" round size="sm" @click="openUserDialog(props.row)")
    template(v-slot:body-cell-delete="props")
      q-td(:props="props")
        q-btn(icon="delete" color="red" round size="sm" @click="removeUser(props.row.id)")
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
          :submitBtn="{text: 'Guardar'}"
          :actionExtra="cancelForm"
          :actionSubmit="handleForm")
  q-dialog(v-model="open_relations" backdrop-filter="blur(4px)")
    q-card(style="width: 700px; max-width: 80vw")
      q-card-section.row.items-center.q-pb-none.text-h6.bg-primary.text-white Compañias para {{user.fullname}}
      q-card-section
       user-cias-component(:user="user" :cias="cias" @updateData="updateData")
       q-btn.q-mt-md.full-width(label="Cerrar" icon="close" @click="open_relations=false" color="primary")
</template>

<script setup>
 import { useQuasar } from 'quasar';
 import { ref, onMounted, computed } from 'vue';
 import { useUsersStore } from 'stores/users.js';
 import { GlobalNotificator } from '../composables/notificator.js';
 import { useRequests } from '../composables/requestor';
 import { useValidator } from '../composables/validator.js';
 import { userModel, userFormRules, userFormFields } from '../models/user.js';
 import { normalizeDate } from '../composables/dateHandler';
 import FormBuilderComponent from '../components/FormBuilderComponent.vue';
 import UserCiasComponent from '../components/UserCiasComponent.vue';

 // Required variables
 const $q = useQuasar();
 const { validate, clearError, Errors, clearAllFormErrors, injectError } = useValidator();
 const { getAllData, deleteRecord, createRecord, updateRecord, modules, onRequest, getModuleData } = useRequests();
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
   { name: 'cias', align: 'center',label: 'CIAS', field: 'cias_count', sortable: false },
   { name: 'cias_btn', align: 'center',label: '', sortable: false },
   { name: 'open', align: 'center',label: 'Ver', sortable: false },
   { name: 'delete', align: 'center',label: 'Eliminar', sortable: false },
 ]

 // Component variables
 const open_relations = ref(false)


 // Methods
 const cancelForm = () => {
   resetUser();
   open_dialog.value = false;
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

  const handleForm = async () => {
   validate('users', user.value, userFormRules)
   if (!Errors.users.errors_data.count) {
     let res = {};
     user.value.birthday = normalizeDate(user.value.birthday)
     if (user.value.id) {
       res = await updateRecord('users', 'users/admin/user', user.value);
       if ([200, 201].includes(res.status)) {
         res.data.message && GlobalNotificator(res.data.message, 'positive');
         resetUser();
         open_dialog.value = false;
       } else {
         GlobalNotificator('Por favor revise el formulario', 'negative');
         Object.keys(res.errors).forEach(e => {
           injectError('users', e, res.errors[e])
         })
       }
     } else {
       res = await createRecord('users', 'users/admin/users', user.value)
       if ([200, 201].includes(res.status)) {
         res.data.message && GlobalNotificator(res.data.message, 'positive');
         resetUser();
         open_dialog.value = false;
       } else {
         GlobalNotificator('Por favor revise los valores', 'negative');
         Object.keys(res.errors).forEach(e => {
           injectError('users', e, res.errors[e])
         })
       }
     }
   }
   getAllData('users', '/users/admin/users', pagination.value, {}, true)
 }

 const removeUser = (id) => {
   $q.dialog({
     title: 'Confirme',
     message: 'Seguro que desea eliminar el registro?',
     cancel: true,
     persistent: true,
   }).onOk(async () => {
     const res = await deleteRecord('users', `users/admin/user/${id}`)
     if (res.status == 200) {
       res.data.message && GlobalNotificator(res.data.message, 'positive');
       getAllData('users', 'users/admin/users', pagination.value, {}, true)
     } else {
       res.data.message && GlobalNotificator(res.data.message, 'negative');
     }
   });
 }

 const updateData = async () => {
   await getAllData('users', 'users/admin/users', {}, true)
 }

 const resetUser = () => {
   user.value = JSON.parse(JSON.stringify(userModel.value))
 }

 const openRelations = async (data) => {
   user.value = JSON.parse(JSON.stringify(data));
   await getModuleData('cias', `cias/admin/user_relations?id=${user.value.id}`, 'ciasforuser')
   open_relations.value = true;
 }
 onMounted(() => {
   getAllData('users', 'users/admin/users', {}, true)
   user.value = userModel.value
 })
</script>

<style lang="scss">

</style>
