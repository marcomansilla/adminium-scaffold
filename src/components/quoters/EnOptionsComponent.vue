<template lang="pug">
div#en_options
  .text-h4.mp-title Propuestas El Norte - Anual
  .row
    .col-md-3.col-sm-4.col-xs-12.col-lg-2.col-xl-2.q-pa-sm(
      v-for="alternativa in props.options"
      :class="getClass(alternativa.PlanCobertura.Letra)")
      .mp-box
        .head.flex.flex-center
          .row
            .col-12
              .title.text-h4 {{alternativa.PlanCobertura.Letra}}
            .col-12
              div.q-mt-md(v-if="alternativa.Franquicia")
                p.text-bold Franquicia ${{Number(alternativa.Franquicia.Valor).toLocaleString()}}
        div.q-pa-md.flex.flex-center
          .row
            .col-12
              .text-h6.center ${{Number(alternativa.PremioContado).toLocaleString()}} de contado
            .col-12.center
              p.separator O
            .col-12.center
              p.center 4 cuotas de
              .text-h4.center.cuota.text-bold ${{Number(alternativa.CuotaImporte).toLocaleString()}}
            .col-12.center
              p Total financiado ${{Number(alternativa.PremioFinanciado).toLocaleString()}}
        q-btn.full-width(
          :class="getClass(alternativa.PlanCobertura.Letra)"
          label="Detalles"
          @click="display_details(alternativa, 'en')")
  q-dialog(v-model="open_details" backdrop-filter="blur(4px)")
    q-card(style="width: 700px; max-width: 80vw")
      q-card-section.row.items-center.q-pb-none.text-h6.bg-primary.text-white Detalles cobertura {{selected_proposal.PlanCobertura.Letra}}
      q-card-section
        p Cobertura: {{selected_proposal.PlanCobertura.Descripcion}}
        p Adicionales
        ul
          li(v-for="aditional in parseAditionals") {{aditional.Nombre}}
        p Importe cuota ${{parseFloat(selected_proposal.CuotaImporte).toLocaleString()}}
        p Total financiado ${{parseFloat(selected_proposal.PremioFinanciado).toLocaleString()}}
        p Importe contado ${{parseFloat(selected_proposal.PremioContado).toLocaleString()}}
        p Prima ${{parseFloat(selected_proposal.Prima).toLocaleString()}}
        p(v-if="selected_proposal.Franquicia") Franquicia: ${{parseFloat(selected_proposal.Franquicia.Valor).toLocaleString()}}
        q-btn.q-mt-md.full-width(label="Cerrar" icon="close" @click="open_details=false" color="primary")
</template>

<script setup>
 import { ref, computed } from 'vue';

 const selected_proposal = ref({});
 const open_details = ref(false);
 const props = defineProps(['options'])

 const aditionals = [
   {
     "Equivalente": "FLIAPROTEGIDA",
     "Id": 1,
     "Nombre": "FAMILIA PROTEGIDA (BÁSICO)"
   },
   {
     "Equivalente": "FLIAPROTEGIDA",
     "Id": 2,
     "Nombre": "FAMILIA PROTEGIDA (DUPLICAR)"
   },
   {
     "Equivalente": "FLIAPROTEGIDA",
     "Id": 3,
     "Nombre": "FAMILIA PROTEGIDA (TRIPLICAR)"
   },
   {
     "Equivalente": "SOS",
     "Id": 10,
     "Nombre": "SOS 300KM"
   },
   {
     "Equivalente": "SOS",
     "Id": 20,
     "Nombre": "SOS 100KM"
   },
   {
     "Equivalente": "SOS",
     "Id": 30,
     "Nombre": "SOS 200KM"
   },
   {
     "Equivalente": "SOS",
     "Id": 40,
     "Nombre": "SOS 800KM"
   },
   {
     "Equivalente": "MEGACOBERTURA",
     "Id": 95,
     "Nombre": "MEGA COBERTURAS"
   },
   {
     "Equivalente": "GRANIZO",
     "Id": 99,
     "Nombre": "GRANIZO"
   }
 ];

 const display_details = (dt) => {
   selected_proposal.value = JSON.parse(JSON.stringify(dt))
   selected_proposal.value.cia = 'rus'
   open_details.value = true;
 }

 const parseAditionals = computed(() => {
  const selected = selected_proposal.value.Adicionales.map(a => a.Id);
  const result = [];
  aditionals.forEach(a => {
    if (selected.includes(a.Id)) {
      result.push(a)
    }
  console.log(result)
  })
  return result
 })
 const getClass = (letra) => {
   if (letra.toLowerCase().includes('a')) {
     return "estilo_a"
   }

   if (letra.toLowerCase().includes('b')) {
     return "estilo_b"
   }

   if (letra.toLowerCase().includes('c')) {
     return "estilo_c"
   }

   if (letra.toLowerCase().includes('d')) {
     return "estilo_d"
   }
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

 .estilo_a {
   .head, .q-btn {
     background-color: #fcc900
   }

   .q-btn {
     color: #ffffff;
   }

   .cuota {
     color: #fcc900
   }

 }

 .estilo_b {
   .head, .q-btn {
     background-color: #ac9672
   }

   .q-btn {
     color: #ffffff;
   }

   .cuota {
     color: #ac9672
   }
 }

 .estilo_c {
   .head, .q-btn {
     background-color: #408a54
   }

   .q-btn {
     color: #ffffff;
   }

   .cuota {
     color: #408a54
   }
 }

 .estilo_d {
   .head, .q-btn {
     background-color: #0078e2
   }

   .q-btn {
     color: #ffffff;
   }

   .cuota {
     color: #0078e2
   }
 }
</style>
