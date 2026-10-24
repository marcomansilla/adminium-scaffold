<template lang="pug">
div#ma_options
  .text-h4.mp-title Propuestas Mercantil Andina - Cuatrimestral
  .row
    .col-md-3.col-sm-6.col-xs-12.col-lg-3.col-xl-2.q-pa-sm(
      v-for="option in props.options")
      .mp-box
        .head.flex.flex-center
          .row
            .col-12
              .title.text-h5 {{option.texto ? option.texto : option.descripcion}}
            .col-12
              div.q-mt-md(v-if="option.franquicia")
                p.text-bold Franquicia ${{Number(option.franquicia).toLocaleString()}}
        div.q-pa-md.flex.flex-center
          .row
            .col-12
              .text-h6.center ${{Number(option.costo).toLocaleString()}} de contado
            .col-12.center
              p.separator O
            .col-12.center
              p.center 4 cuotas de
              .text-h5.center.cuota.text-bold ${{Number(option.desglose.cuotas[0].premio).toLocaleString()}}
        q-btn.full-width(
          label="Detalles"
          @click="display_details(option)"
          icon="list")
  q-dialog(v-model="open_details" backdrop-filter="blur(4px)")
    q-card(style="width: 700px; max-width: 80vw")
      q-card-section.row.items-center.q-pb-none.text-h6.bg-primary.text-white Detalles cobertura {{selected_proposal.texto ? selected_proposal.texto : selected_proposal.descripcion}}
      q-card-section
        p Cobertura: {{selected_proposal.texto ? selected_proposal.texto : selected_proposal.descripcion}}
        p Riesgos
        ul
          li(v-for="riesgo in selected_proposal.riesgos") {{riesgo}}
        p Importe cuota ${{parseFloat(selected_proposal.desglose.cuotas[0].premio).toLocaleString()}}
        p Importe contado ${{parseFloat(selected_proposal.costo).toLocaleString()}}
        p Prima ${{parseFloat(selected_proposal.desglose.prima).toLocaleString()}}
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
     background-color: #00358E;
   }
 }
 .q-btn {
   background-color: #00358E;
   color: #fff;
 }
</style>
