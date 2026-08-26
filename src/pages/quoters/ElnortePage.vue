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
        steptwo-component
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
      q-step(:name="3" title="Opciones" icon="assignment" disable="") This step wont show up because it is disabled.
      q-step(:name="4" title="Create an ad" icon="add_comment") Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if theyre running and how to resolve approval issues.
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
const step = ref(1)
</script>