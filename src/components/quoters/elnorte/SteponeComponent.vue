<template lang="pug">
#stepone
  p.mp-title Productor
  p.text-grey Hector Muiños - 3314

  #validity.mp-box
    p.mp-title Vigencia
    form
      .row
        .col-3.q-pa-sm
          .q-gutter-sm
            q-radio(v-model="props.tomador.vigencia" val="anual" label="Anual")
            q-radio(v-model="props.tomador.vigencia" val="informar" label="Informar vigencia")
        .col-3.q-pa-sm
          q-input(filled v-model="props.tomador.fecha_inicio" mask="date" label="Fecha de inicio")
            template(v-slot:append)
              q-icon(name="event" class="cursor-pointer")
                q-popup-proxy(cover transition-show="scale" transition-hide="scale")
                  q-date(v-model="props.tomador.fecha_inicio" )
                    div.row.items-center.justify-end
                      q-btn(v-close-popup label="Close" color="primary" flat)
        .col-3.q-pa-sm
          q-input(filled v-model="props.tomador.fecha_fin" mask="date" label="Fecha de fin")
            template(v-slot:append)
              q-icon(name="event" class="cursor-pointer")
                q-popup-proxy(cover transition-show="scale" transition-hide="scale")
                  q-date(v-model="props.tomador.fecha_fin")
                    div.row.items-center.justify-end
                      q-btn(v-close-popup label="Close" color="primary" flat)
        .col-3.q-pa-sm
          q-select(label="Cuotas" :options="options" v-model="props.tomador.cuotas")

  #financial_condition.mp-box
    p.mp-title Datos fiscales
    .row.q-pb-sm
      .col-4.q-pa-sm
        q-select(
          label="Tipo de persona"
          v-model="props.tomador.tipo_persona"
          :options="tipos_persona"
          emit-value
          map-options)
      .col-4.q-pa-sm
        q-select(
          label="Condicion fiscal"
          v-model="props.tomador.condicion_fiscal"
          :option-value="opt => (Object(opt) === opt && 'Valor' in opt ? opt.Valor : null)"
          :option-label="opt => (Object(opt) === opt && 'Descripcion' in opt ? opt.Descripcion : null)"
          :options="IVA"
          emit-value
          map-options)
      .col-4.q-pa-sm
        q-select(
          label="Condicion IIB"
          v-model="props.tomador.condicion_iibb"
          :option-value="opt => (Object(opt) === opt && 'Valor' in opt ? opt.Valor : null)"
          :option-label="opt => (Object(opt) === opt && 'Descripcion' in opt ? opt.Descripcion : null)"
          :options="IIBB"
          emit-value
          map-options)

  #insured_info.mp-box
    p.mp-title Asegurado
    .row.q-pb-sm
      .col-3.q-pa-sm
        q-input(
          label="Asegurado"
          v-model="props.tomador.asegurado")
      .col-3.q-pa-sm
        q-select(
          label="Tipo de documento"
          v-model="props.tomador.tipo_documento"
          :options="tipos_documento"
          emit-value
          map-options)
      .col-3.q-pa-sm
        q-input(label="Numero" v-model="props.tomador.numero")
      .col-3.q-pa-sm
        q-input(label="E-mail" v-model="props.tomador.email")
  </template>

<script setup>
 import { ref, onMounted } from 'vue';
 import { convertDate, modifyDate, normalizeDate } from '../../../composables/dateHandler';
 import { IVA, IIBB } from '../../../utils/fiscal';

 const props = defineProps(['tomador']);
 const vigencia = ref('anual');
 const start_date = ref('');
 const options=[2,3,4];
 const tipos_persona = ref([
   {label: 'Fisica', value: 'F'},
   {label: 'Juridica', value: 'J'}])
 const tipos_documento = ref([
   {value:1,label:"DNI"},
   {value:2,label:"CUIT"},
   {value:3,label:"CUIL"},
   {value:4,label:"PAS"},
   {value:8,label:"CUE"},     ])
 onMounted(() => {
   props.tomador.fecha_inicio = normalizeDate(new Date())
   props.tomador.fecha_fin = normalizeDate(modifyDate(convertDate(new Date()), 365))
 })
</script>
