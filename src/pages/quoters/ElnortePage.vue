<template lang="pug">
q-page.q-pa-md
  h4 Cotizar en El Norte
  div.q-pa-md
    q-stepper(
      v-model="step"
      vertical=""
      color="primary"
      animated="")
      q-step(
        :name="1"
        title="Datos generales"
        caption="Datos del asegurado y vigencia de poliza"
        icon="settings"
        :done="step > 1")
          stepone-component(:tomador="tomador")
          q-btn(
            @click="step = 2"
            color="primary"
            label="Continuar")
      q-step(
        :name="2"
        title="Datos del vehiculo"
        icon="create_new_folder"
        :done="step > 2")
        steptwo-component(:vehicle="vehiculo" :adicionales="adicionales")
        q-stepper-navigation
          q-btn.q-ml-sm(
            flat=""
            @click="step = 1"
            color="primary"
            label="Volver")
          span &nbsp&nbsp
          q-btn(
            :disable="!vehicle_found"
            @click="getOptions()"
            color="primary"
            label="Continuar")
      q-step(
        :name="3"
        title="Propuestas"
        icon="assignment"
        :done="step > 3")
        stepthree-component(:cuotas="tomador.cuotas" :adicionales="adicionales")
        q-stepper-navigation
          q-btn.q-ml-sm(
            flat=""
            @click="step = 2"
            color="primary"
            label="Volver")
          span &nbsp&nbsp
          q-btn(
            @click="step = 4"
            color="primary"
            label="Finalizar")
</template>

<script setup>
 import { ref, toRaw, computed } from 'vue';
 import { useRequests } from '../../composables/requestor';
 import { normalizeDate, toYMD } from '../../composables/dateHandler.js';
 import SteponeComponent from '../../components/quoters/elnorte/SteponeComponent.vue'
 import SteptwoComponent from '../../components/quoters/elnorte/SteptwoComponent.vue'
 import StepthreeComponent from '../../components/quoters/elnorte/StepthreeComponent.vue'

 const { requestModuleData, modules } = useRequests();

 const tomador = ref({
   vigencia: 'anual',
   condicion_fiscal: 5,
   condicion_iibb: 1,
   tipo_persona: 'F',
   tipo_documento: 1,
   asegurado: '',
   fecha_inicio: '',
   fecha_fin: '',
   cuotas: 4,
   email: ''
 })

 const vehiculo = ref({
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
 })

 const payload = ref({
   "Cuotas": {
     "Cantidad": null
   },
   "IntNumero": 3314,
   "RamaId": 4,
   "Tomador": {
     "CondicionIIBB": null,
     "CondicionIVA": null,
     "DocNumero": '',
     "DocTipo": 4,
     "Email": "",
     "Id": null,
     "PersonaTipo": ''
   },
   "Vehiculos": [
     {
       "Accesorios": [],
       "Adicionales": [],
       "AjusteAutomaticoId": null,
       "Anio": null,
       "Es0KM": false,
       "GNC": false,
       "LimiteRC": null,
       "LocalidadId": null,
       "MarcaId": null,
       "ModeloId": null,
       "ProvinciaId": null,
       "SubModeloId": null,
       "UsoId": null,
       "Valor": null
     }
   ],
   "Vigencia": {
     "FechaFin": "",
     "FechaInicio": "",
   }
 })
 const adicionales = ref({Adicionales: []})
 const step = ref(1)

 const createPayload = () => {
   let payload_adicionales = [];
   payload.value.Cuotas.Cantidad = tomador.value.cuotas;
   payload.value.Tomador.CondicionIVA = tomador.value.condicion_fiscal;
   payload.value.Tomador.CondicionIIBB = tomador.value.condicion_iibb;
   payload.value.Tomador.DocNumero = tomador.value.numero;
   payload.value.Tomador.DocTipo = tomador.value.tipo_documento;
   payload.value.Tomador.PersonaTipo = tomador.value.tipo_persona;
   payload.value.Tomador.Email = tomador.value.email;
   payload.value.Vehiculos[0].Anio = vehiculo.value.Anio;
   payload.value.Vehiculos[0].MarcaId = vehiculo.value.MarcaId;
   payload.value.Vehiculos[0].Accesorios = vehiculo.value.Accesorios;
   payload.value.Vehiculos[0].Valor = vehiculo.value.Valor;
   payload.value.Vehiculos[0].UsoId = vehiculo.value.uso;
   payload.value.Vehiculos[0].LimiteRC = vehiculo.value.limiterc;
   payload.value.Vehiculos[0].ModeloId = vehiculo.value.ModeloId;
   payload.value.Vehiculos[0].SubModeloId = vehiculo.value.SubmodeloId;
   payload.value.Vehiculos[0].ProvinciaId = vehiculo.value.provincia_id;
   payload.value.Vehiculos[0].LocalidadId = vehiculo.value.localidad_id;
   payload.value.Vehiculos[0].UsoId = vehiculo.value.uso;
   payload.value.Vehiculos[0].AjusteAutomaticoId = vehiculo.value.ajuste;
   adicionales.value.Adicionales.forEach(a => {
     if (a.Selected == true) {
      const rc = {Id: a.Id}
      payload_adicionales.push(rc)
     }
   })
   payload.value.Vehiculos[0].Adicionales = payload_adicionales;
   payload.value.Vigencia.FechaInicio = toYMD(normalizeDate(tomador.value.fecha_inicio));
   payload.value.Vigencia.FechaFin = toYMD(normalizeDate(tomador.value.fecha_fin));
 }

 const vehicle_found = computed(() => {
   if (modules.elnorte?.carbyplate) {
     return true
   }
   return false
 })

 const getOptions = async () => {
   await createPayload();
   await requestModuleData('elnorte', 'integrations/elnorte/polizas', 'policies', payload.value)
   step.value = 3;
 }
</script>
