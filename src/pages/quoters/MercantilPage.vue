<template lang="pug">
q-page.q-pa-md
  h4 Cotizar en Mecantil Andina
  .row
      .col-12
        .row
          .col-12.flex.flex-center.center
            form(@submit.prevent="findCar()" style="min-width:100%")
              .row
                .col-12.q-pb-md.flex.flex-center.center
                  q-input(v-model="plate" label="Ingrese el dominio" style="width:15%")
                .col-12.flex.flex-center.center
                  q-btn(
                    type="submit"
                    label="Buscar..."
                    icon="search"
                    color="primary")
</template>

<script setup>
 import { ref, computed, watch } from 'vue';
 import { useQuasar } from 'quasar';
 import { GlobalNotificator } from '../../composables/notificator.js';
 import { useRequests } from '../../composables/requestor';

 const { getModuleData, requestModuleData, modules, resetModuleField } = useRequests();

 const $q = useQuasar();
 const plate = ref('');

 const findCar = async() => {
   //resetModuleField('elnorte', 'carbyplate');
   $q.loading.show({
     message: 'Buscando vehiculo...'
   })
   await getModuleData('integrations', `integrations/infoauto/${plate.value}`, 'codia')
   $q.loading.hide()
   const record = JSON.parse(JSON.stringify(modules.integrations?.codia));
   if (Object.keys(record).length == 0) {
     console.log(record)
     GlobalNotificator('El vehiculo no se ha encontrado, por favor revise los datos', 'negative')
   }
 }

</script>

<style lang="scss">


</style>
