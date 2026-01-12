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
    :rows="props.users")
    template(v-slot:body-cell-delete="props")
      q-td(:props="props")
        q-btn(icon="delete" color="red" round size="sm" @click="removeUserFromCia(props.row.id)")
</template>

<script setup>
 import { ref } from 'vue';

 const props = defineProps(['users']);
 const filter_text = ref('');
 // Table
 const columns = [
   { name: 'name', align: 'left', label: 'Productor', field: 'name', sortable: true },
   { name: 'delete', align: 'center',label: 'Eliminar', sortable: false },
 ]

</script>

<style lang="scss">


</style>
