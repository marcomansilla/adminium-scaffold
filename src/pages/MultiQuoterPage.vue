<template lang="pug">
q-page.q-pa-md
  h4 Multi cotizador
  .mp-box(v-if="!(current_vehicle)")
    form(@submit.prevent="findCar()" style="min-width:100%")#rquote
      p.mp-title Dominio
      .row.full-width.flex.flex-center
        .col-12.q-pa-lg.centered
          q-input(
            label="Dominio"
            stack-label
            v-model="plate")
        .col-12.center
          q-btn.q-pl-lg.q-pr-lg(icon="search" label="Buscar vehiculo" color="primary" type="submit")
  .row.full-width.flex.mp-box(v-if="current_vehicle")
    .mp-title Datos del vehiculo
    .col-12
      .row.full-width
        .col-3.q-pa-md
          q-input(label="Marca" v-model="current_vehicle.brand" disable)
        .col-3.q-pa-md
          q-input(label="Modelo" v-model="current_vehicle.model" disable)
        .col-3.q-pa-md
          q-input(label="Version" v-model="current_vehicle.version" disable)
        .col-3.q-pa-md
          q-input(label="Año" v-model="current_vehicle.year" disable)
        .col-3.q-pa-md
          q-input(label="Suma asegurada" v-model="display_data.secured_amount" disable)
            template(v-slot:prepend)
              q-icon(name="attach_money")
        .col-3.q-pa-md
          q-select(
            v-model="payload.provincia_id"
            label="Provincia"
            use-input
            hide-selected
            fill-input
            :options="provincias_list"
            @filter="filterProvincias"
            :option-value="opt => (Object(opt) === opt && 'id' in opt ? opt.id : null)"
            :option-label="opt => (Object(opt) === opt && 'descripcion' in opt ? opt.descripcion : null)"
            emit-value
            map-options)
        .col-3.q-pa-md
          q-select(
            :key="payload.localidad_id"
            label="Localidad"
            use-input
            hide-selected
            fill-input
            :options="localidades_list"
            @filter="filterLocalidades"
            v-model="payload.localidad_id"
            :option-value="opt => (Object(opt) === opt && 'LocalidadId' in opt ? opt.LocalidadId : null)"
            :option-label="opt => (Object(opt) === opt && 'NombreCompleto' in opt ? opt.NombreCompleto : null)"
            emit-value
            map-options)
        .col-3.q-pa-md
          q-toggle(
            label="Tiene GNC"
            stack-label
            true-value="SI"
            false-value="NO"
            v-model="payload.gnc")
        .col-12.q-pa-md
          q-btn.full-width(
            color="primary"
            label="Cotizar"
            icon="no_crash"
            @click="sendData")
  div.mp-box(v-if="rus_quotes.success")
    rus-options-component(:options="rus_quotes.data")
  div.mp-box(v-if="en_quotes.success")
    en-options-component(:options="en_quotes.data")

</template>

<script setup>
 import { useQuasar } from 'quasar';
 import { ref, computed, watch, onMounted } from 'vue';
 import { useRequests } from '../composables/requestor';
 import { GlobalNotificator } from '../composables/notificator.js';
 import { Provincias } from '../utils/provincias';
 import RusOptionsComponent from '../components/quoters/RusOptionsComponent.vue';
 import EnOptionsComponent from '../components/quoters/EnOptionsComponent.vue';

 const $q = useQuasar();
 const provincias_list = ref(Provincias);
 const open_details = ref(false);
 const selected_proposal = ref({});
 const { getModuleData, requestModuleData, modules, resetModuleField } = useRequests();
 const plate = ref('');
 const payload = ref({
   zip: '',
   gnc: 'NO',
   is0km: false,
   secured_amount: 0,
   provincia_id: 4,
   localidad_id: null
 })
 const localidades_list = ref([]);
 const display_data = ref({
   secured_amount: 0
 })
 const current_vehicle = computed(() => {
   const vehicle = modules.elnorte?.carbyplate

   if (vehicle) {
     const secured_amount = JSON.parse(JSON.stringify(vehicle.Valores.filter(vl => vl.Anio == vehicle.Anio)[0]));
     display_data.value.secured_amount = secured_amount.Valor.toLocaleString();
     return {
       brand: vehicle.Marca.Nombre,
       model: vehicle.Modelo.Nombre,
       version: vehicle.SubModelo.Nombre,
       year: vehicle.Anio,
       codia: vehicle.InfoAutoCodigo,
       secured_amount: secured_amount.Valor
     }
   }
   return vehicle
 })

 const proposalAditionals = computed(()=>{
   var result = [];
   var selected_aditionals = [];
   if (Object.keys(selected_proposal.value)) {
     selected_aditionals = selected_proposal.value.Adicionales.map(a => a.Id)
     props.adicionales.Adicionales.forEach(a => {
       if (selected_aditionals.includes(a.Id)) {
         result.push(a)
       }
     })
   }
   return result
 })

 const display_details = (dt, cia) => {
   selected_proposal.value = JSON.parse(JSON.stringify(dt))
   selected_proposal.value.cia = cia
   open_details.value = true;
 }



 const rus_quotes = computed(() => {
   const quotes = modules.quoter?.rusquotes
   if (quotes) {
     quotes.data = quotes.data.sort((a,b) => a.premio - b.premio)
     return quotes
   }
   return []
 })

 const en_quotes = computed(() => {
   const quotes = modules.quoter?.elnortequotes
   console.log(quotes)
   if (quotes) {
     return quotes
   }
   return []
 })

 const localidades = computed(() => {
   const lc = modules.elnorte?.localidades?.Resultado ? modules.elnorte?.localidades?.Resultado : []
   localidades_list.value = lc
   return lc
 })

 const filterProvincias = (val, update, abort) => {
   if (val.length < 2) {
     abort()
     return
   }

   update(() => {
     const needle = val.toLowerCase()
     provincias_list.value = Provincias.filter(
       v => v.descripcion.toLowerCase().indexOf(needle) > -1
     )
   })
 }

 const filterLocalidades = (val, update, abort) => {
   update(() => {
     const needle = val.toLowerCase()
     localidades_list.value = localidades.value.filter(
       v => v.NombreCompleto.toLowerCase().indexOf(needle) > -1
     )
   })
 }
 const findCar = async() => {
   resetModuleField('elnorte', 'carbyplate');
   $q.loading.show({ message: 'Buscando vehiculo...'})
   await requestModuleData('elnorte', 'integrations/elnorte/carbyplate', 'carbyplate', {patente: plate.value})
   $q.loading.hide()
   const record = JSON.parse(JSON.stringify(modules.elnorte?.carbyplate));
   if (Object.keys(record).length == 0) {
     console.log(record)
     GlobalNotificator('El vehiculo no se ha encontrado, por favor revise los datos', 'negative')
   }
 }

 const sendData = async () => {
   const zip = payload.value.localidad_id;
   $q.loading.show({ message: 'Buscando propuestas...'})
   payload.value.codia = current_vehicle.value.codia;
   payload.value.year = current_vehicle.value.year;
   payload.value.secured_amount = current_vehicle.value.secured_amount;
   payload.value.zip = zip % 10 === 0 ? zip / 10 : zip
   await requestModuleData('quoter', 'integrations/rus/multipolizas', 'rusquotes', payload.value)
   await requestModuleData('quoter', 'integrations/elnorte/multipolizas', 'elnortequotes', payload.value)
   $q.loading.hide()
 }

 watch(() => payload.value.provincia_id, async (nv, ov) => {
   await requestModuleData('elnorte', 'integrations/elnorte/localidades', 'localidades', {provincia_id: nv})
 })

 onMounted(async() => {
   await requestModuleData('elnorte', 'integrations/elnorte/localidades', 'localidades', {provincia_id: payload.value.provincia_id})
 })
</script>

<style lang="scss" scoped>
 .card {
   padding: 1em;
   &-body {
     border: 2px solid #c0c0c0;
     padding-bottom: 5px;
   }
   &-title {
     font-size: 1.3em;
     padding-top: 10px;
     font-weight: bold;
     height: 2.5em;
     background-color: #001BDA;
     color: #fff;
     width: 100%;
   }
 }

  .mp-box {
   .head {
     height: 8em;
     text-align: center;
     width: 100%;
     padding: .5em;
     border-radius: 10px 10px 0 0;
     color: #fff;
     background-color: blue;
   }
 }

 .text-bold {
   font-weight: bold !important;
 }

 .separator {
   display: flex;
   align-items: center;
   gap: 10px;
   text-align: center;
   width: 100%;
 }

 .separator::before,
 .separator::after {
   content: "";
   flex: 1;
   height: 2px;
   background: #c0c0c0;
 }
</style>
