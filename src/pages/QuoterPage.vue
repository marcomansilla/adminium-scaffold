<template lang="pug">
q-page.q-pa-md
  h3 Cotizador El Norte
  form
    .row
      .col-2.q-pa-md
        q-select(
          size="md"
          label="Seleccione la marca"
          v-model="query.brand_id"
          emit-value
          map-options
          :loading="modules.quoter.loading"
          :options="brands")
      .col-4.q-pa-md
        q-select(
          label="Seleccione el modelo"
          v-model="query.codia"
          :disable="!query.brand_id"
          emit-value
          map-options
          :options="models")
      .col-2.q-pa-md
        q-select(
          label="Año"
          v-model="query.year"
          :disable="!query.brand_id"
          emit-value
          map-options
          :options="years")
      .col-2.q-pa-md
        q-input(
          label="Codigo Postal"
          v-model="query.cp"
          :disable="!query.brand_id")
      .col-2.q-pa-md
        q-toggle(v-model="query.gnc" label="GNC" left-label color="primary" size="xl")
    br
    q-btn.full-width(label="Buscar..." icon="search" color="primary" @click="search")
  q-separator
  div.q-pa-md#rus_quotes(v-if="rusResults.length")
    .text-h5 Resultados RUS
    .row.flex
      .col-desktop-3.col-md-3.col-sm-6.q-pa-md(v-for="(item, key ) in rusResults" :key="key")
        q-card.q-scroll-card
          q-card-section.header
            .text-h6 {{item.codigoRC}} {{item.codigoCasco}}
            .text-h5 {{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.premio)}}
          q-card-section.body
            ul
              li(v-for="r in item.riesgos") {{r.descripcion}}

          q-card-section.footer
            q-btn.full-width(icon="handshake" color="primary" label="contratar")
  ul
    li(v-for="item in rusResults") {{item.codigoCasco}} {{Object.keys(item)}}
</template>

<script setup>
 import { ref, onMounted, computed, watch } from 'vue';
 import { useRequests } from '../composables/requestor';
 import { range } from '../composables/utils';

 const brands = computed(() => {
   const brands = modules.quoter.brands?.brands;
   return brands
   if (brands && brands.lenght) {
     return brands
   }
   return []
 })

 const models = computed(() => {
   const model_list = modules.quoter?.models;
   return model_list
   if (model_list && model_list.lenght) {
     return model_list;
   }
   return []
 })


 const years = computed(() => {
   const currentYear = new Date().getFullYear()+1;
   return range(1977, currentYear).reverse()
 })

 const { getModuleData, requestModuleData, modules } = useRequests()

 const query = ref({
   brand_id: null,
   codia: null,
   gnc: false,
   year: null,
   cp: null
 })
 const searchRequest = ref(false);
 const elnorteResults = ref([]);
 const lpsResults = ref([]);
 const Results = ref([]);

 const rusResults = computed(() => {
   const result = modules.quoter?.search_rus?.data;
   if (result && result.success) {
     //return result.quotes.filter(q => q.descripcionComercial && q.descripcionComercial.length).reverse()
     return result.quotes.filter(q => q.descripcionComercial).reverse()
   }
   return []
 })

 const search = async () => {
   const payload = query.value;
   payload.gnc = 'NO';
   if (query.value.gnc == true){
     payload.gnc = 'SI';
   }
   await requestModuleData('quoter', 'quoter/search_rus', 'search_rus', payload)
   await requestModuleData('quoter', 'quoter/search_elnorte', 'search_elnorte', payload)
   searchRequest.value = true;
 }
 watch(()=> query.value, async (nv, ov)=> {
   if (nv && nv != query.value.brand_id) {
     const payload = {
       brand_id: query.value.brand_id,
       infoauto_token: modules.quoter.brands.infoauto_token
     }
     await requestModuleData('quoter', 'quoter/models', 'models', payload)
   }
 }, {deep:true})

 onMounted(async () => {
   await getModuleData('quoter', 'quoter/brands', 'brands', true);
 })
</script>

<style lang="scss" scoped>
  form {
    background-color: #f29d1e;
    border-radius: 10px;
    margin: 1rem;
    padding: 2rem 1rem;
  }

  #rus_quotes {
    .header {
      background-color: #004DED;
      color: #ffffff;
      text-align: center;
    }
  }

  .body {
    text-align:justify
  }
</style>
