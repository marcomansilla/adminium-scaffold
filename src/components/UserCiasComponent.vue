<template lang="pug">
  q-input.full-width(label="Filtrar" v-model="filter_text" )
    q-icon(name="filter_alt" size="lg")
  br
  br
  q-table(
    :filter="filter_text"
    title="Cias"
    :columns="columns"
    :rows="cias")
    template(v-slot:body-cell-delete="props")
      q-td(:props="props")
        q-btn(icon="delete" color="red" round size="sm" @click="removeUserFromUser(props.row.id)")
  .text-h6.q-pt-md.q-pb-md Agregar compañia
  .row
    .col-8.q-pl-md.q-pr-md
      q-select(
        :options="modules.cias.ciasforuser"
        label="Compañias"
        v-model="selected_id"
        use-input
        @filter="filterFn")
    .col-4.q-pl-md.q-pr-md
      q-btn.center.full-width(label="Agregar" color="primary" icon="save" size="md" @click="addRelation" :disabled="selected_id == null")
</template>

<script setup>
 import { ref, onMounted } from 'vue';
 import { useRequests } from '../composables/requestor.js';
 import { GlobalNotificator } from '../composables/notificator.js';

 const emit = defineEmits(['updateData'])
 const selected_id = ref(null)
 const { modules, getModuleData, createRecord, deleteRecord } = useRequests();
 const cias = ref([]);
 const user = ref({});
 const props = defineProps(['user', 'cias']);
 const filter_text = ref('');
 // Table
 const columns = [
   { name: 'name', align: 'left', label: 'Compañia', field: 'name', sortable: true },
   { name: 'delete', align: 'center',label: 'Eliminar', sortable: false }
 ]

 const addRelation = async () => {
   const payload = {cia_id: selected_id.value.value, user_id: props.user.id};
   const res = await createRecord('cias', 'cias/admin/relations',payload);
   if ([200, 201].includes(res.status)) {
     res.data.message && GlobalNotificator(res.data.message, 'positive');
     await getModuleData('cias', `cias/admin/cias/foruser?user_id=${props.user.id}`, 'ciasforuser')
     await getModuleData('cias', `cias/admin/user_relations?id=${props.user.id}`, 'user_cias');
     emit('updateData')
     cias.value = modules.cias.user_cias
     selected_id.value = null
   } else (
     GlobalNotificator('Ha ocurrido un error', 'negative')
   )

 }

 const options = ref(modules.cias.usersforuser)
 const filterFn = (val, update) => {
   if (val === '') {
     update(() => {
       options.value = modules.cias.usersforusers

       // here you have access to "ref" which
       // is the Vue reference of the QSelect
     })
     return
   }

   update(() => {
     const needle = val.toLowerCase()
     options.value = modules.cias.usersforuser.filter(v => v.toLowerCase().indexOf(needle) > -1)
   })
 }

 const removeUserFromUser = async(id) => {
   const res = await deleteRecord('cias', `cias/admin/cia_relations/${id}`)
   if ([200, 201].includes(res.status)) {
     res.data.message && GlobalNotificator(res.data.message, 'positive');
     await getModuleData('cias', `cias/admin/cias/foruser?user_id=${props.user.id}`, 'ciasforuser')
     await getModuleData('cias', `cias/admin/user_relations?id=${props.user.id}`, 'user_cias');
     emit('updateData')
     cias.value = modules.cias.user_cias
     selected_id.value = null
   } else (
     GlobalNotificator('Ha ocurrido un error', 'negative')
   )
 }

 onMounted(async () => {
   user.value = props.user;
   cias.value = modules.cias.ciasforuser;
   await getModuleData('cias', `cias/admin/cias/foruser?user_id=${props.user.id}`, 'ciasforuser')
 })

</script>

<style lang="scss">


</style>
