<template lang="pug">
#steptwo
  div
    p.mp-title Busqueda
    .row
      .col-8
        .row
          .col-6
            q-radio(v-model="finder" val="search" label="Ingresar datos")
            span &nbsp&nbsp
            q-radio(v-model="finder" val="plate" label="Patente")
          .col-6(v-if="finder == 'plate'")
            .row.flex-center
              .col-6
                q-input.q-pr-sm(v-model="plate" label="Ingrese el dominio")
              .col-6
                q-btn(
                  label="Buscar..."
                  icon="search"
                  color="primary"
                  rounded @click="findCar()")
      .col-12.mp-box(v-if="current_vehicle")
        p.mp-title Vehiculo
        p {{form.vehicle}}
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
              v-model="form.vehicle.uso"
              :options="current_vehicle.Usos"
              :option-value="opt => (Object(opt) === opt && 'Id' in opt ? opt.Id : null)"
              :option-label="opt => (Object(opt) === opt && 'Descripcion' in opt ? opt.Descripcion : null)"
              emit-value
              map-options)
          .col-3.q-pa-md
            q-input(v-model="secured_amount" disable label="Suma asegurada")
            p suma {{secured_amount}}
          .col-3.q-pa-md
            q-select(
              v-model="form.vehicle.provincia_id"
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
              label="Localidad"
              use-input
              hide-selected
              fill-input
              :options="localidades_list"
              @filter="filterLocalidades"
              v-model="form.vehicle.localidad_id"
              :option-value="opt => (Object(opt) === opt && 'LocalidadId' in opt ? opt.LocalidadId : null)"
              :option-label="opt => (Object(opt) === opt && 'NombreCompleto' in opt ? opt.NombreCompleto : null)"
              emit-value
              map-options)
          .col-3.q-pa-md
            .row
              .col-6
                q-checkbox(label="Es 0km" v-model="form.vehicle.es_0km")
              .col-6
                q-checkbox(label="Tiene GNC" v-model="form.vehicle.gnc")
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
                    v-model="form.vehicle.limiterc"
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
                    v-model="form.vehicle.ajuste"
                    :option-value="opt => (Object(opt) === opt && 'Id' in opt ? opt.Id : null)"
                    :option-label="opt => (Object(opt) === opt && 'Nombre' in opt ? opt.Nombre : null)"
                    emit-value
                    map-options)
          .col-12
            .mp-box
              p.mp-title Adicionales
              .row#adicionales
                .col-4.q-pa-lg(v-for="adicional in adicionales.Adicionales")
                  q-btn(
                    :label="adicional.Nombre"
                    :icon="mapIcon(adicional.Equivalente)"
                    size="lg"
                    :color="adicional.Selected ? 'secondary' : 'primary'"
                    @click="toggleAditional(adicional.Id)")
          .col-12
            .mp-box
              p.mp-title Accesorios
              p accesorio {{accesorio}}
              p accesorios {{form.vehicle.Accesorios}}
              p accesorios {{current_vehicle.Accesorios}}
              q-chip(
                removable
                color="secondary"
                text-color="white"
                v-for="(val, key) in form.vehicle.Accesorios"
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
 import { ref, computed, watch } from 'vue';
 import { useRequests } from '../../../composables/requestor';
 import { Provincias } from '../../../utils/provincias';

 const props = defineProps(['vehicle']);
 const { getModuleData, requestModuleData, modules } = useRequests();
 const provincias_list = ref(Provincias);
 const localidades_list = ref([]);
 const finder = ref('plate');
 const plate = ref('');
 const accesorio = ref({Id: null, Valor: null});
 const adicionales = ref('');
 const form = ref({
   vehicle:{
     suma_asegurada: 0,
     provincia_id: 4,
     es_0km: false,
     gnc: false,
     limiterc: null,
     ajuste: null,
     Accesorios: []
   }
 });

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
   console.log(element)
   accesorio.value.Nombre = element.Nombre;
   form.value.vehicle.Accesorios.push(accesorio.value)
   accesorio.value = {Id: null, Valor: null, Nombre: null}
 }

 const removeAccesory = (id) => {
   console.log(form.value.vehicle.Accesorios.splice(id, 1), id)
 }

 const secured_amount = computed(() => {
    const value = JSON.parse(JSON.stringify(current_vehicle.value.Valores.filter(vl => vl.Anio == current_vehicle.value.Anio)[0]));
    console.log(value)
    if (value) {
      return `$${Number(value.Valor).toLocaleString()}`
    }
    return 'N/I'
 })

 const localidades = computed(() => {
   const lc = modules.elnorte?.localidades?.Resultado ? modules.elnorte?.localidades?.Resultado : []
   localidades_list.value = lc
   return lc
 })

 const current_vehicle = computed(() => {
   const ck = modules.elnorte?.carbyplate ? modules.elnorte.carbyplate : null;
   if (ck) {
     requestModuleData('elnorte', 'integrations/elnorte/localidades', 'localidades', {provincia_id: form.value.vehicle.provincia_id})
     form.value.vehicle.limiterc = 3 || null;
     form.value.vehicle.ajuste = 10 || null;
     form.value.vehicle.Anio = ck.Anio;
   }
   return ck
 });

 const findCar = () => {
   requestModuleData('elnorte', 'integrations/elnorte/carbyplate', 'carbyplate', {patente: plate.value})
 }

 const getAdicionales = async () => {
   if (form.value.vehicle.Anio && form.value.vehicle.uso) {
     const payload = {
       MarcaId: current_vehicle.value.Marca.Id,
       ModeloId: current_vehicle.value.Modelo.Id,
       SubModeloId: current_vehicle.value.SubModelo.Id,
       UsoId: form.value.vehicle.uso,
       Anio: form.value.vehicle.Anio
     }
     await requestModuleData('elnorte', 'integrations/elnorte/adicionales', 'adicionales', payload)
   }
   const ad = JSON.parse(JSON.stringify(modules.elnorte?.adicionales ? modules.elnorte.adicionales : []));
   if (Object.keys(ad).length > 0) {
     for(let i =0;i<ad.Adicionales.length;i++) {
       ad.Adicionales[i].Selected = false;
     }
   }
   return adicionales.value = ad
 }

 const toggleAditional = (id) => {
   const index = adicionales.value.Adicionales.findIndex(el => el.Id == id);
   console.log(adicionales.value.Adicionales[index])
   if (adicionales.value.Adicionales[index].Selected == true) {
      adicionales.value.Adicionales[index].Selected = false
   } else {
     for(let i=0;i<adicionales.value.Adicionales.length;i++) {
       const el = adicionales.value.Adicionales[i]
       if (el.Equivalente == adicionales.value.Adicionales[index].Equivalente && el.Id != id && el.Selected == true) {
         adicionales.value.Adicionales[i].Selected = false
       }
     }
     adicionales.value.Adicionales[index].Selected = true
   }
   console.log(index)
 }

 watch (() => form.value.vehicle, (nv, ov) => {
   getAdicionales()
 }, {deep: true})
 watch(() => form.value.vehicle.anio, (nv, ov)=> {
   if (nv) {
     const valor = current_vehicle.value.Valores.filter(cv => cv.Anio  == nv)[0].Valor;
     form.value.vehicle.suma_asegurada = Number(valor).toLocaleString();
   }
 }, {deep: true} )

 watch(() => form.value.vehicle.provincia_id, (nv, ov) => {
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