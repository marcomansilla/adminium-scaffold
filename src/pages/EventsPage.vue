<template lang="pug">
q-page.q-pa-md
  h3 Eventos
  q-input.full-width(label="Filtrar" v-model="filter_text" )
    q-icon(name="filter_alt" size="lg")
  br
  br
  q-table(
    v-model:pagination="pagination"
    :filter="filter_text"
    @request="(props) => onRequest(props, 'events', 'events/admin/events', filter_text, filter_fields)"
    title="Events"
    :columns="columns"
    :rows="events")
    template(v-slot:body-cell-users="props")
      q-td(:props="props")
        q-btn(icon="groups" color="primary" round size="sm" @click="showEventUsers(props.row)")
    template(v-slot:body-cell-open="props")
      q-td(:props="props")
        q-btn(icon="remove_red_eye" color="primary" round size="sm" @click="openEventDialog(props.row)")
    template(v-slot:body-cell-delete="props")
      q-td(:props="props")
        q-btn(icon="delete" color="red" round size="sm" @click="removeEvent(props.row.id)")
  q-btn.add-btn(icon="add" round size="xl" @click="openEventDialog()")

  q-dialog(v-model="open_dialog" backdrop-filter="blur(4px)")
    q-card(style="width: 700px; max-width: 80vw")
      q-card-section.row.items-center.q-pb-none.text-h6.bg-primary.text-white {{event.id ? 'Actualizar datos' : 'Nuevo evento'}}
      q-card-section
        form-builder-component(
          :fields="eventFormFields"
          v-model="event"
          formname="events"
          :rules="eventFormRules"
          :extraBtn="{text: 'Cancelar', color:'red', display:true, icon:'close'}"
          :submitBtn="{text: 'Enviar', color:'primary', icon:'send'}"
          :actionExtra="cancelForm"
          :actionSubmit="handleForm")
      q-card-section.full-width.row.items-center.q-pb-none.text-h7.bg-primary.text-white
        template(v-if="cia_users.count > 0")
          .col-2
            p Productores: {{cia_users.count}}
          .col-5
            q-btn.q-mb-md(:label="`Productores con E-mail: ${cia_users.with_email}`" @click="guest_dialog=true")
          .col-5
            p Productores a notificar {{cia_users.email_receptors.filter(c => c.notify).length}}
        template(v-else-if="cia_users.count == 0")
          .col-12
            p No hay productores para la compañia
        template(v-else)
          .col-12
            p Seleccione una compañia

  q-dialog(v-model="guest_dialog" backdrop-filter="blur(4px)")
    q-card(style="width: 700px; max-width: 80vw")
      q-card-section.row.items-center.q-pb-none.text-h6.bg-primary.text-white Productores notificados {{cia_users.email_receptors.filter(c => c.notify).length}}
      q-card-section
        table
          tr(v-for="item, index in cia_users.email_receptors.filter(u => u.notify)")
            td {{item.name}}
            td
              q-checkbox(v-model="cia_users.email_receptors[index].notify")
        q-btn.full-width.q-ma-md(icon="close" label="Cerrar" color="primary" @click="guest_dialog=false")
</template>

<script setup>
 import { useQuasar } from 'quasar';
 import { ref, onMounted, computed, onBeforeMount, watch } from 'vue';
 import { GlobalNotificator } from '../composables/notificator.js';
 import { useRequests } from '../composables/requestor';
 import { useValidator } from '../composables/validator.js';
 import { eventModel, eventFormRules, eventFormFields } from '../models/event.js';
 import { normalizeDate } from '../composables/dateHandler';
 import FormBuilderComponent from '../components/FormBuilderComponent.vue';

 // Required variables
 const $q = useQuasar();
 const { validate, clearError, Errors, clearAllFormErrors, injectError } = useValidator();
 const { getAllData, deleteRecord, createRecord, updateRecord, modules, onRequest, getModuleData } = useRequests();
 const filter_text = ref('');
 const filter_fields = 'cia_name, date'
 const events = computed(() => modules.events?.data);
 const pagination = computed(() => modules.events?.pagination);
 const open_dialog = ref(false)
 const guest_dialog = ref(false)
 const event = ref({});


 // Component variables
 const cia_users = computed(() => {
   if (modules.events?.cia_users) {
     return modules.events?.cia_users
   }
   return []
 });
 const open_relations = ref(false)


 // Table
 const columns = [
   { name: 'cia_name', align: 'left', label: 'Compañia', field: 'cia_name', sortable: true },
   { name: 'date', align: 'left',label: 'Fecha', field: 'date', sortable: false },
   { name: 'user_count', align: 'left',label: 'Productores', field: 'user_count', sortable: false },
   { name: 'open', align: 'center',label: 'Ver', sortable: false },
   { name: 'delete', align: 'center',label: 'Eliminar', sortable: false },
 ]

 // Methods
 const cancelForm = () => {
   resetEvent();
   open_dialog.value = false;
 }
 const openEventDialog = (data=null) => {
   if (data) {
     event.value = data;
     open_dialog.value = true;
   } else {
     resetEvent();
     open_dialog.value = false;
   }
   open_dialog.value = true
 }

 const handleForm = async () => {
   validate('events', event.value, eventFormRules)
   if (!Errors.events.errors_data.count) {
     let res = {};
     if (event.value.id) {
       res = await updateRecord('events', 'events/admin/event', event.value);
       if ([200, 201].includes(res.status)) {
         res.data.message && GlobalNotificator(res.data.message, 'positive');
         resetEvent();
         open_dialog.value = false;
       } else {
         GlobalNotificator('Por favor revise el formulario', 'negative');
         Object.keys(res.errors).forEach(e => {
           injectError('events', e, res.errors[e])
         })
       }
     } else {
       res = await createRecord('events', 'events/admin/events', event.value)
       if ([200, 201].includes(res.status)) {
         res.data.message && GlobalNotificator(res.data.message, 'positive');
         resetEvent();
         open_dialog.value = false;
       } else {
         GlobalNotificator('Por favor revise los valores', 'negative');
         Object.keys(res.errors).forEach(e => {
           injectError('events', e, res.errors[e])
         })
       }
     }
   }
   getAllData('events', '/events/admin/events', pagination.value)
 }

 const removeEvent = (id) => {
   $q.dialog({
     title: 'Confirme',
     message: 'Seguro que desea eliminar el registro?',
     cancel: true,
     persistent: true,
   }).onOk(async () => {
     const res = await deleteRecord('events', `events/admin/event/${id}`)
     if (res.status == 200) {
       res.data.message && GlobalNotificator(res.data.message, 'positive');
       getAllData('events', 'events/admin/events', pagination.value)
     } else {
       res.data.message && GlobalNotificator(res.data.message, 'negative');
     }
   });
 }
 const resetEvent = () => {
   event.value = JSON.parse(JSON.stringify(eventModel.value))
 }
 onMounted(() => {
   getAllData('events', 'events/admin/events')
 })

 onBeforeMount(() => {
   getModuleData('events', 'events/admin/cias', 'cias')
 })

 const updateData = async () => {
   await getAllData('events', 'events/admin/events')
 }

 watch(() => event.value.cia_id, (newCiaId, oldCiaId) => {
   if (newCiaId.value) {
     getModuleData('events', `events/admin/cia_users/${newCiaId.value}`, 'cia_users');
   }
 });
</script>

<style lang="scss">

</style>
