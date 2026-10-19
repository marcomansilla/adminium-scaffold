<template lang="pug">
div#rus_options
  p.mp-title Propuestas RUS
  .row
    .col-md-3.col-sm-6.col-xs-12.col-lg-2.col-xl-2.q-pa-sm(
      v-for="option in props.options")
      .mp-box
        .head.flex.flex-center
          .row
            .col-12
              .title.text-h5 {{option.descripcionComercial ? option.descripcionComercial : option.codigoRC}}
            .col-12
              div.q-mt-md(v-if="option.franquicia")
                p.text-bold Franquicia ${{Number(option.franquicia).toLocaleString()}}
        div.q-pa-md.flex.flex-center
          .row
            .col-12
              .text-h6.center ${{Number(option.premio).toLocaleString()}} de contado
            .col-12.center
              p.separator O
            .col-12.center
              p.center 4 cuotas de
              .text-h5.center.cuota.text-bold ${{Number(option.premio).toLocaleString()/4}}
        q-btn.full-width(
          label="Detalles"
          @click="display_details(option)"
          icon="list")
  q-dialog(v-model="open_details" backdrop-filter="blur(4px)")
    q-card(style="width: 700px; max-width: 80vw")
      q-card-section.row.items-center.q-pb-none.text-h6.bg-primary.text-white Detalles cobertura {{selected_proposal.descripcionComercial ? selected_proposal.descripcionComercial : selected_proposal.codigoRC}}
      q-card-section
        p Cobertura: {{selected_proposal.descripcionComercial ? selected_proposal.descripcionComercial : selected_proposal.codigoRC}}
        p Riesgos
        ul
          li(v-for="riesgo in selected_proposal.riesgos") {{riesgo.descripcion}}
        p Importe cuota ${{parseFloat(selected_proposal.premio/4).toLocaleString()}}
        p Importe contado ${{parseFloat(selected_proposal.premio).toLocaleString()}}
        p Prima ${{parseFloat(selected_proposal.prima).toLocaleString()}}
        p(v-if="selected_proposal.franquicia") Franquicia: ${{parseFloat(selected_proposal.franquicia).toLocaleString()}}
        q-btn.q-mt-md.full-width(label="Cerrar" icon="close" @click="open_details=false" color="primary")
</template>

<script setup>
 import { ref, computed } from 'vue';

 const selected_proposal = ref({});
 const open_details = ref(false);
 const props = defineProps(['options'])

 const display_details = (dt) => {
   selected_proposal.value = JSON.parse(JSON.stringify(dt))
   selected_proposal.value.cia = 'rus'
   open_details.value = true;
 }
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
     background-color: #0078E2;
   }
 }
 .q-btn {
   background-color: #0078E2;
   color: #fff;
 }
</style>