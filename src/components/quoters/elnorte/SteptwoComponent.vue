<template lang="pug">
#steptwo
  div
    p.mp-title Busqueda
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

      .col-12.mp-box(v-if="current_vehicle")
        p.mp-title Vehiculo
        .row
          .col-3.q-pa-md
            q-input(v-model="current_vehicle.Anio" label="Año" disable)
          .col-3.q-pa-md
            q-input(label="Marca" v-model="current_vehicle.Marca.Nombre" disable)
          .col-3.q-pa-md
            q-input(label="Modelo" v-model="current_vehicle.Modelo.Nombre" disable)
          .col-3.q-pa-md
            q-select(
              label="Uso"
              v-model="props.vehicle.uso"
              :options="current_vehicle.Usos"
              :disable="current_vehicle.Usos.length == 1"
              :option-value="opt => (Object(opt) === opt && 'Id' in opt ? opt.Id : null)"
              :option-label="opt => (Object(opt) === opt && 'Descripcion' in opt ? opt.Descripcion : null)"
              emit-value
              map-options)
          .col-3.q-pa-md
            q-input(v-model="secured_amount" disable label="Suma asegurada")
            p suma {{secured_amount}}
          .col-3.q-pa-md
            q-select(
              v-model="props.vehicle.provincia_id"
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
              :key="props.vehicle.localidad_id"
              label="Localidad"
              use-input
              hide-selected
              fill-input
              :options="localidades_list"
              @filter="filterLocalidades"
              v-model="props.vehicle.localidad_id"
              :option-value="opt => (Object(opt) === opt && 'LocalidadId' in opt ? opt.LocalidadId : null)"
              :option-label="opt => (Object(opt) === opt && 'NombreCompleto' in opt ? opt.NombreCompleto : null)"
              emit-value
              map-options)
          .col-3.q-pa-md
            .row
              .col-6
                q-checkbox(label="Es 0km" v-model="props.vehicle.es_0km" :disable="Number(current_year) > Number(current_vehicle.Anio)")
              .col-6
                q-checkbox(label="Tiene GNC" v-model="props.vehicle.gnc")
      .col-12(v-if="current_vehicle")
        .row
          .col-12
            .mp-box
              p.mp-title Condiciones
              .row
                .col-6.q-pa-sm
                  q-select(
                    label="Limite RC"
                    use-input
                    hide-selected
                    fill-input
                    :options="current_vehicle.Limites"
                    v-model="props.vehicle.limiterc"
                    :option-value="opt => (Object(opt) === opt && 'Codigo' in opt ? opt.Codigo : null)"
                    :option-label="opt => (Object(opt) === opt && 'importe' in opt ? opt.importe : null)"
                    emit-value
                    map-options)
                .col-6.q-pa-sm
                  q-select(
                    label="Ajuste automatico"
                    use-input
                    hide-selected
                    fill-input
                    :options="current_vehicle.AjustesAutomaticos"
                    v-model="props.vehicle.ajuste"
                    :option-value="opt => (Object(opt) === opt && 'Id' in opt ? opt.Id : null)"
                    :option-label="opt => (Object(opt) === opt && 'Nombre' in opt ? opt.Nombre : null)"
                    emit-value
                    map-options)
          .col-12
            .mp-box
              p.mp-title Adicionales
              .row#adicionales
                .col-4.q-pa-lg(v-for="adicional in props.adicionales.Adicionales")
                  q-btn(
                    :label="adicional.Nombre"
                    :icon="mapIcon(adicional.Equivalente)"
                    size="lg"
                    :color="adicional.Selected ? 'secondary' : 'primary'"
                    @click="toggleAditional(adicional.Id)")
          .col-12
            .mp-box
              p.mp-title Accesorios
              q-chip(
                removable
                color="secondary"
                text-color="white"
                v-for="(val, key) in props.vehicle.Accesorios"
                @remove="removeAccesory(key)") {{val.Nombre}} ${{Number(val.Valor).toLocaleString()}}
              .row
                .col-3.q-mr-md
                  q-select(
                    label="Accesorio"
                    use-input
                    hide-selected
                    fill-input
                    :options="current_vehicle.Accesorios"
                    v-model="accesorio.Id"
                    :option-value="opt => (Object(opt) === opt && 'Id' in opt ? opt.Id : null)"
                    :option-label="opt => (Object(opt) === opt && 'Nombre' in opt ? opt.Nombre : null)"
                    emit-value
                    map-options)
                .col-3.q-mr-md
                  q-input(label="Importe" :hint="accesoryHint()" v-model="accesorio.Valor")
                .col-2
                  q-btn(label="Agregar" color="primary" icon="add_chart" @click="addAccesory")
      .col-12(v-if="finder=='search'")
        .row
          .col-3.q-pa-xs
            q-input(label="Año")
          .col-3.q-pa-xs
            q-input(label="Vehiculo")
          .col-6
            .row
              .col-8.q-pa-xs
                q-input(label="Uso")
              .col-4.q-pa-xs
                q-input(label="Tipo")
          .col-3.q-pa-xs
            q-input(label="Suma asegurada")
          .col-3.q-pa-xs
            q-input(label="Provincia")
          .col-3.q-pa-xs
            q-input(label="Localidad")
          .col-3
            .row
              .col-8.q-pa-xs
                q-checkbox(label="Es 0km")
              .col-4.q-pa-xs
                q-checkbox(label="Tiene GNC")

  .row(v-if="finder == 'search'")
    .col-12.mp-box
      p.mp-title Condiciones
      .row
        .col-6
          q-input.q-pa-xs(label="Limite RC")
        .col-6
          q-input.q-pa-xs(label="Ajuste autmatico")
        .col-12
          q-input(label="Aplicacion")
    .col-12.mp-box
      p.mp-title Adicionales
    .col-12.mp-box
      p.mp-title Accesorios
</template>

<script setup>
 import { useQuasar } from 'quasar';
 import { GlobalNotificator } from '../../../composables/notificator.js';
 import { ref, computed, watch } from 'vue';
 import { useRequests } from '../../../composables/requestor';
 import { Provincias } from '../../../utils/provincias';

 const $q = useQuasar();
 const props = defineProps(['vehicle', 'adicionales']);
 const { getModuleData, requestModuleData, modules, resetModuleField } = useRequests();
 const provincias_list = ref(Provincias);
 const localidades_list = ref([]);
 const finder = ref('plate');
 const plate = ref('');
 const accesorio = ref({Id: null, Valor: null});
 const current_year = new Date().getFullYear();
 const mapIcon = (name) => {
   const dict = {
     'GRANIZO': 'local_car_wash',
     'FLIAPROTEGIDA': 'diversity_1',
     'SOS': 'construction',
     'MEGACOBERTURA': 'engineering'}
   return dict[name]
 }

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

 const accesoryHint = () => {
   if (accesorio.value.Id) {
     let ac_index = current_vehicle.value.Accesorios.findIndex(a => a.Id == accesorio.value.Id)
     let ca = current_vehicle.value.Accesorios[ac_index]
     return `Minimo $${Number(ca.Minimo).toLocaleString()} - Maximo ${Number(ca.Maxio)>0 ? $Number(ca.Maximo).toLocaleString() : 'Sin limite'}`
   }
   return 'Seleccione el accesorio'
 }

 const addAccesory = () => {
   let element = JSON.parse(JSON.stringify(current_vehicle.value.Accesorios.filter(ac => ac.Id == accesorio.value.Id)[0]));
   accesorio.value.Nombre = element.Nombre;
   props.vehicle.Accesorios.push({
     Id: accesorio.value.Id,
     Valor: accesorio.value.Valor
   })
   accesorio.value = {Id: null, Valor: null, Nombre: null}
 }

 const removeAccesory = (id) => {
   props.vehicle.Accesorios.splice(id, 1)
 }

 const secured_amount = computed(() => {
   const value = JSON.parse(JSON.stringify(current_vehicle.value.Valores.filter(vl => vl.Anio == current_vehicle.value.Anio)[0]));
   let result = 'N/I'
   if (value) {
     result = `$${Number(value.Valor).toLocaleString()}`
     props.vehicle.Valor = value.Valor;
   }
   return result
 })

 const localidades = computed(() => {
   const lc = modules.elnorte?.localidades?.Resultado ? modules.elnorte?.localidades?.Resultado : []
   localidades_list.value = lc
   return lc
 })

 const current_vehicle = computed(() => {
   var ck = modules.elnorte?.carbyplate ? modules.elnorte.carbyplate : null;
   if (ck && ck.Marca.Id) {
     requestModuleData('elnorte', 'integrations/elnorte/localidades', 'localidades', {provincia_id: props.vehicle.provincia_id})
     props.vehicle.limiterc = 3 || null;
     props.vehicle.ajuste = 10 || null;
     props.vehicle.Anio = ck.Anio;
     props.vehicle.MarcaId = ck.Marca.Id;
     props.vehicle.localidad_id = 50000;
     props.vehicle.ModeloId = ck.Modelo.Id;
     props.vehicle.SubmodeloId = ck.SubModelo.Id;
     props.vehicle.es_0km = Number(ck.Anio) > Number(current_year) ? true : false;
     props.vehicle.codia = ck.InfoAutoCodigo;
   } else {
     props.vehicle = {
       codia: null,
       is_domain: false,
       provincia_id: 4,
       localidad_id: 50000,
       es_0km: false,
       gnc: false,
       limiterc: null,
       ajuste: null,
       numero: null,
       uso: 1,
       MarcaId: null,
       ModeloId: null,
       SubmodeloId: null,
       Accesorios: [],
       Adicionales: [],
       Valor: 0
     }
     ck = null
   }

   console.log(JSON.parse(JSON.stringify(ck)), props.vehicle.es_0km)
   return ck
 });

 const findCar = async() => {
   resetModuleField('elnorte', 'carbyplate');
   $q.loading.show({
     message: 'Buscando vehiculo...'
   })
   props.vehicle.is_domain = true;
   await requestModuleData('elnorte', 'integrations/elnorte/carbyplate', 'carbyplate', {patente: plate.value})
   $q.loading.hide()
   const record = JSON.parse(JSON.stringify(modules.elnorte?.carbyplate));
   if (Object.keys(record).length == 0) {
     console.log(record)
     GlobalNotificator('El vehiculo no se ha encontrado, por favor revise los datos', 'negative')
   }
 }

 const getAdicionales = async () => {
   if (props.vehicle.Anio && props.vehicle.uso) {
     const payload = {
       MarcaId: current_vehicle.value.Marca.Id,
       ModeloId: current_vehicle.value.Modelo.Id,
       SubModeloId: current_vehicle.value.SubModelo.Id,
       UsoId: props.vehicle.uso,
       Anio: props.vehicle.Anio
     }
     await requestModuleData('elnorte', 'integrations/elnorte/adicionales', 'adicionales', payload)
   }
   const ad = await  JSON.parse(JSON.stringify(modules.elnorte?.adicionales ? modules.elnorte.adicionales : []));
   if (Object.keys(ad).length > 0) {
     for(let i =0;i<ad.Adicionales.length;i++) {

       if ([2,20,95,99].includes(ad.Adicionales[i].Id)) {
         ad.Adicionales[i].Selected = true;
       } else {
         ad.Adicionales[i].Selected = false;
       }
     }
   }
   props.adicionales.Adicionales = ad.Adicionales
 }

 const toggleAditional = (id) => {
   const index = props.adicionales.Adicionales.findIndex(el => el.Id == id);
   if (props.adicionales.Adicionales[index].Selected == true) {
     props.adicionales.Adicionales[index].Selected = false
   } else {
     for(let i=0;i<props.adicionales.Adicionales.length;i++) {
       const el = props.adicionales.Adicionales[i]
       if (el.Equivalente == props.adicionales.Adicionales[index].Equivalente && el.Id != id && el.Selected == true) {
         props.adicionales.Adicionales[i].Selected = false
       }
     }
     props.adicionales.Adicionales[index].Selected = true
   }
 }

 watch(() => props.vehicle, (nv, ov) => {
   getAdicionales()
 }, {deep: true})

 watch(() => props.vehicle.anio, (nv, ov)=> {
   if (nv) {
     const valor = current_vehicle.value.Valores.filter(cv => cv.Anio  == nv)[0].Valor;
     props.vehicle.Valor = Number(valor).toLocaleString();
   }
 }, {deep: true} )

 watch(() => props.vehicle.provincia_id, (nv, ov) => {
   requestModuleData('elnorte', 'integrations/elnorte/localidades', 'localidades', {provincia_id: nv})
 })


</script>

<style lang="scss">

 #adicionales {
   .q-btn {
     height: 100%;
     width: 100%;
     .q-icon {
       font-size: 4rem !important;
       display: inline-block !important;
       width: 100%;
     }
   }
 }

</style>
