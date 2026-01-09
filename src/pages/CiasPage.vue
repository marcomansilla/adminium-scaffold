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
    @request="(props) => onRequest(props, 'cias', 'cias/admin/cias', filter_text, filter_fields)"
    title="Usuarios"
    :columns="columns"
    :rows="cias")
    template(v-slot:body-cell-open="props")
      q-td(:props="props")
        q-btn(icon="remove_red_eye" color="primary" round size="sm" @click="openCiaDialog(props.row)")
    template(v-slot:body-cell-delete="props")
      q-td(:props="props")
        q-btn(icon="delete" color="red" round size="sm" @click="removeCia(props.row.id)")
  q-btn.add-btn(icon="add" round size="xl" @click="openCiaDialog()")


  q-dialog(v-model="open_dialog" backdrop-filter="blur(4px)")
    q-card(style="width: 700px; max-width: 80vw")
      q-card-section.row.items-center.q-pb-none.text-h6.bg-primary.text-white {{cia.id ? 'Actualizar datos' : 'Nuevo usuario'}}
      q-card-section
        form-builder-component(
          :fields="ciaFormFields"
          v-model="cia"
          formname="cias"
          :rules="ciaFormRules"
          :extraBtn="{text: 'Cancelar', color:'red', display:true}"
          :actionExtra="cancelForm"
          :actionSubmit="handleForm")


</template>

<script setup>
 import { useQuasar } from 'quasar';
 import { ref, onMounted, computed } from 'vue';
 import { GlobalNotificator } from '../composables/notificator.js';
 import { useRequests } from '../composables/requestor';
 import { useValidator } from '../composables/validator.js';
 import { ciaModel, ciaFormRules, ciaFormFields } from '../models/cia.js';
 import { normalizeDate } from '../composables/dateHandler';
 import FormBuilderComponent from '../components/FormBuilderComponent.vue';


 // Required variables
 const $q = useQuasar();
 const { validate, clearError, Errors, clearAllFormErrors, injectError } = useValidator();
 const { getAllData, deleteRecord, createRecord, updateRecord, modules, onRequest } = useRequests();
 const filter_text = ref('');
 const filter_fields = 'name, contact, email'
 const cias = computed(() => modules.cias?.data);
 const pagination = computed(() => modules.cias?.pagination);
 const open_dialog = ref(false)
 const cia = ref({});

 const columns = [
   { name: 'name', align: 'left', label: 'Nombre', field: 'name', sortable: true },
   { name: 'phone', align: 'left',label: 'Telefono', field: 'phone', sortable: false },
   { name: 'email', align: 'left',label: 'E-mail', field: 'email', sortable: false },
   { name: 'contact', align: 'left',label: 'Contacto', field: 'contact', sortable: false },
   { name: 'open', align: 'left',label: 'Ver', sortable: false },
   { name: 'delete', align: 'left',label: 'Eliminar', sortable: false },
 ]

 const cancelForm = () => {
   resetCia();
   open_dialog.value = false;
 }
 const openCiaDialog = (data=null) => {
   if (data) {
     cia.value = data;
     open_dialog.value = true;
   } else {
     resetCia();
     open_dialog.value = false;
   }
   open_dialog.value = true
 }

  const handleForm = async () => {
   validate('cias', cia.value, ciaFormRules)
   if (!Errors.cias.errors_data.count) {
     let res = {};
     if (cia.value.id) {
       res = await updateRecord('cias', 'cias/admin/cia', cia.value);
       if ([200, 201].includes(res.status)) {
         res.data.message && GlobalNotificator(res.data.message, 'positive');
         resetCia();
         open_dialog.value = false;
       } else {
         GlobalNotificator('Por favor revise el formulario', 'negative');
         Object.keys(res.errors).forEach(e => {
           injectError('cias', e, res.errors[e])
         })
       }
     } else {
       res = await createRecord('cias', 'cias/admin/cias', cia.value)
       if ([200, 201].includes(res.status)) {
         res.data.message && GlobalNotificator(res.data.message, 'positive');
         resetCia();
         open_dialog.value = false;
       } else {
         GlobalNotificator('Por favor revise los valores', 'negative');
         Object.keys(res.errors).forEach(e => {
           injectError('cias', e, res.errors[e])
         })
       }
     }
   }
   getAllData('cias', '/cias/admin/cias', pagination.value)
 }

 const removeCia = (id) => {
   $q.dialog({
     title: 'Confirme',
     message: 'Seguro que desea eliminar el registro?',
     cancel: true,
     persistent: true,
   }).onOk(async () => {
     const res = await deleteRecord('cias', `cias/admin/cia/${id}`)
     if (res.status == 200) {
       res.data.message && GlobalNotificator(res.data.message, 'positive');
       getAllData('cias', 'cias/admin/cias', pagination.value)
     } else {
       res.data.message && GlobalNotificator(res.data.message, 'negative');
     }
   });
 }
 const resetCia = () => {
   cia.value = JSON.parse(JSON.stringify(ciaModel.value))
 }
 onMounted(() => {
   getAllData('cias', 'cias/admin/cias')
   cia.value = ciaModel.value
 })
</script>

<style lang="scss">

</style>
