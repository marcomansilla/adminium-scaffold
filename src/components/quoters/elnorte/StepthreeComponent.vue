<template lang="pug">
#steptwo(key="1")
  div
    p.mp-title Propuestas encontradas
    .row
      .col-md-3.col-sm-4.col-xs-12.col-lg-2.col-xl-2.q-pa-sm(
        v-for="alternativa in alternativas"
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
                p.center {{props.cuotas}} cuotas de
                .text-h4.center.cuota.text-bold ${{Number(alternativa.CuotaImporte).toLocaleString()}}
              .col-12.center
                p Total financiado ${{Number(alternativa.PremioFinanciado).toLocaleString()}}
          q-btn.full-width(:class="getClass(alternativa.PlanCobertura.Letra)" label="Detalles" @click="display_details(alternativa)")
  q-dialog(v-model="open_details" backdrop-filter="blur(4px)")
    q-card(style="width: 700px; max-width: 80vw")
      q-card-section.row.items-center.q-pb-none.text-h6.bg-primary.text-white Detalles cobertura {{selected_proposal.PlanCobertura.Letra}}
      q-card-section
        p Cobertura: {{selected_proposal.PlanCobertura.Descripcion}}
        p Adicionales
        ul
          li(v-for="aditional in proposalAditionals") {{aditional.Nombre}}
        p Importe cuota ${{parseFloat(selected_proposal.CuotaImporte).toLocaleString()}}
        p Total financiado ${{parseFloat(selected_proposal.PremioFinanciado).toLocaleString()}}
        p Importe contado ${{parseFloat(selected_proposal.PremioContado).toLocaleString()}}
        p Prima ${{parseFloat(selected_proposal.Prima).toLocaleString()}}
        q-btn.q-mt-md.full-width(label="Cerrar" icon="close" @click="open_details=false" color="primary")
</template>

<script setup>
 import { ref, computed, watch } from 'vue';
 import { useRequests } from '../../../composables/requestor';

 const props = defineProps(['cuotas', 'adicionales']);
 const { getModuleData, requestModuleData, modules } = useRequests();

 const selected_proposal = ref({})
 const open_details = ref(false)

 const alternativas = computed(() => {
   var policies = modules.elnorte?.policies ? modules.elnorte?.policies.Cotizacion.Vehiculos[0].Alternativas : []
   if (policies.length) {
     policies = policies.sort((a,b)=> parseFloat(a.CuotaImporte) - parseFloat(b.CuotaImporte))
   }
   return policies
 })

 const display_details = (dt) => {
   selected_proposal.value = JSON.parse(JSON.stringify(dt))
   open_details.value = true;
 }
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
