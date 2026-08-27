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
        steptwo-component(:vehicle="vehiculo")
        q-stepper-navigation
          q-btn.q-ml-sm(
            flat=""
            @click="step = 1"
            color="primary"
            label="Volver")
          span &nbsp&nbsp
          q-btn(
            @click="step = 4"
            color="primary"
            label="Continar")
      q-step(:name="3" title="Opciones disponibles" icon="assignment")
        q-stepper-navigation
          q-btn(color="primary" label="Finish")
          q-btn(flat="" @click="step = 2" color="primary" label="Back" class="q-ml-sm")
</template>

<script setup>
import { ref } from 'vue';
import SteponeComponent from '../../components/quoters/elnorte/SteponeComponent.vue'
import SteptwoComponent from '../../components/quoters/elnorte/SteptwoComponent.vue'

const tomador = ref({
  vigencia: 'anual',
  condicion_fiscal: 'cf',
  condicion_iibb: 'n',
  tipo_persona: 'F',
  tipo_documento: 1,
  asegurado: '',
  fecha_inicio: '',
  fecha_fin: '',
  cuotas: 4
})

const vehiculo = ref({
  suma_asegurada: 0,
  provincia_id: 4,
  es_0km: false,
  gnc: false,
  limiterc: null,
  ajuste: null,
  Accesorios: []
})
const step = ref(1)
</script>