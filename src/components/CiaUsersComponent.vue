<template lang="pug">
  q-input.full-width(label="Filtrar" v-model="filter_text" )
    q-icon(name="filter_alt" size="lg")
  br
  br
  p {{props.cia_users}}
  q-table(
    :filter="filter_text"
    title="Productores"
    :columns="columns"
    :rows="users")
    template(v-slot:body-cell-delete="props")
      q-td(:props="props")
        q-btn(icon="delete" color="red" round size="sm" @click="removeUserFromCia(props.row.id)")
  .text-h6.q-pt-md.q-pb-md Agregar productor
  .row
    .col-8.q-pl-md.q-pr-md
      q-select(
        :options="modules.cias.usersforcia"
        label="Productores"
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
 const users = ref([]);
 const props = defineProps(['users', 'cia']);
 const filter_text = ref('');
 // Table
 const columns = [
   { name: 'name', align: 'left', label: 'Productor', field: 'name', sortable: true },
   { name: 'delete', align: 'center',label: 'Eliminar', sortable: false }
 ]

 const addRelation = async () => {
   const payload = {user_id: selected_id.value.value, cia_id: props.cia.id};
   const res = await createRecord('cias', 'cias/admin/relations',payload);
   if ([200, 201].includes(res.status)) {
     res.data.message && GlobalNotificator(res.data.message, 'positive');
     await getModuleData('cias', `cias/admin/users/forcia?cia_id=${props.cia.id}`, 'usersforcia')
     await getModuleData('cias', `cias/admin/cia_relations/${props.cia.id}`, 'cia_users');
     emit('updateData')
     users.value = modules.cias.cia_users
     selected_id.value = null
   } else (
     GlobalNotificator('Ha ocurrido un error', 'negative')
   )

 }

 const options = ref(modules.cias.usersforcia)
 const filterFn = (val, update) => {
   if (val === '') {
     update(() => {
       options.value = modules.cias.usersforcias

       // here you have access to "ref" which
       // is the Vue reference of the QSelect
     })
     return
   }

   update(() => {
     const needle = val.toLowerCase()
     options.value = modules.cias.usersforcia.filter(v => v.toLowerCase().indexOf(needle) > -1)
   })
 }

 const removeUserFromCia = async(id) => {
   const res = await deleteRecord('cias', `cias/admin/cia_relations/${id}`)
   if ([200, 201].includes(res.status)) {
     res.data.message && GlobalNotificator(res.data.message, 'positive');
     await getModuleData('cias', `cias/admin/users/forcia?cia_id=${props.cia.id}`, 'usersforcia')
     await getModuleData('cias', `cias/admin/cia_relations/${props.cia.id}`, 'cia_users');
     emit('updateData')
     users.value = modules.cias.cia_users
     selected_id.value = null
   } else (
     GlobalNotificator('Ha ocurrido un error', 'negative')
   )
 }
 onMounted(() => {
   getModuleData('cias', `cias/admin/users/forcia?cia_id=${props.cia.id}`, 'usersforcia');
   users.value = props.users;
 })

</script>

<style lang="scss">


</style>
