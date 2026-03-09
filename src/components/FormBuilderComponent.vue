<template lang="pug">
q-form.q-pa-md
  template(v-for="field in fields" :key="field.name")
    q-input(
      v-if="field.type === 'text' || field.type === 'number'"
      v-model="formData[field.name]"
      :disable="field.disabled"
      :hint="field.hint"
      :placeholder="field.placeholder"
      :icon="field.icon || ''"
      :type="field.type"
      :label="field.label || field.name"
      :error="Errors[formname].errors_data.fields.includes(field.name)"
      :error-message="Errors[formname].errors[field.name]"
      @keydown="clearError(formname, field.name)")
    q-input(
      v-if="field.type === 'password'"
      v-model="formData[field.name]"
      :icon="field.icon || ''"
      :type="field.type"
      :label="field.label || field.name"
      :error="Errors[formname].errors_data.fields.includes(field.name)"
      :error-message="Errors[formname].errors[field.name]"
      @keydown="clearError(formname, field.name)")
    q-input(
      v-if="field.type === 'textarea'"
      type="textarea"
      :hint="field.hint"
      :placeholder="field.placeholder"
      v-model="formData[field.name]"
      :icon="field.icon || ''"
      :type="field.type"
      :label="field.label || field.name"
      :error="Errors[formname].errors_data.fields.includes(field.name)"
      :error-message="Errors[formname].errors[field.name]"
      @keydown="clearError(formname, field.name)")
    q-select(
      v-else-if="field.type === 'select'"
      v-model="formData[field.name]"
      :hint="field.hint"
      :placeholder="field.placeholder"
      :icon="field.icon || ''"
      emit-value
      map-options
      :options="field.options"
      :label="field.label || field.name"
      :error="Errors[formname].errors_data.fields.includes(field.name)"
      :error-message="Errors[formname].errors[field.name]"
      @update:model-value="() => {clearError(formname, field.name)}")
    q-select(
      v-else-if="field.type === 'selectfilter'"
      v-model="filteredValues[field.name]"
      :hint="field.hint"
      :placeholder="field.placeholder"
      :icon="field.icon || ''"
      use-input
      use-chips
      @filter="(val, update) => (filterFn(val, update, field.name))"
      :options="filters[field.name]"
      :label="field.label || field.name"
      :error="Errors[formname].errors_data.fields.includes(field.name)"
      :error-message="Errors[formname].errors[field.name]"
      @update:model-value="() => {setFilterValues(formname, field.name)}")
    q-checkbox(
      v-else-if="field.type === 'checkbox'"
      v-model="formData[field.name]"
      :hint="field.hint"
      :label="field.label || field.name")
    q-toggle(
      v-else-if="field.type === 'switch'"
      :label="field.label"
      :hint="field.hint"
      left-label
      v-model="formData[field.name]"
      :color="field.color || 'primary'"
      @update:model-value="() => {setFilterValues(formname, field.name, val)}")
    q-file(
      v-else-if="field.type === 'file'"
      :hint="field.hint"
      color="teal"
      filled
      v-model="formData[field.name]"
      :multiple="field.multiple || false"
      :use-chips="field.use_chips || false"
      :append="field.append || false"
      :label="field.label"
      :accept="field.extensions || '.jpg, .jpeg, .png, */image'"
      :max-file-size="field.max_file_size *1000000 || 1000000"
      @rejected="(rejectedEntries) => { onRejected(rejectedEntries, field.name)}"
      :error="Errors[formname].errors_data.fields.includes(field.name)"
      :error-message="Errors[formname].errors[field.name]"
      @update:model-value="() => {clearError(formname, field.name)}")
      template(v-slot:prepend)
        q-icon(:name="field.icon || 'cloud_upload'")
    q-input(
      v-else-if="field.type === 'date'"
      filled
      v-model="formData[field.name]"
      locale="en_US"
      :label="field.label"
      :error="Errors[formname].errors_data.fields.includes(field.name)"
      :error-message="Errors[formname].errors[field.name]")
      template(v-slot:append)
        q-icon(name="event" class="cursor-pointer")
          q-popup-proxy(cover transition-show="scale" transition-hide="scale")
            q-date(v-model="formData[field.name]"
              :locale="xignus_locale" mask="DD/MM/YYYY"
              @update:model-value="() => {clearError(formname, field.name)}")
              div.row.items-center.justify-end
                q-btn(v-close-popup label="Cerrar" color="primary" flat)
    div.q-mb-lg(v-if="field.type == 'time'")
      q-input(v-model="formData[field.name]" label="Hora")
        q-btn(icon="access_time" size="sm" color="primary")
          q-popup-proxy(@before-show="updateProxy" cover transition-show="scale" transition-hide="scale")
            q-time(v-model="formData[field.name]")
              div.row.items-center.justify-end.q-gutter-sm
                q-btn(label="Cancel" color="primary" flat v-close-popup)
                q-btn(label="OK" color="primary" flat @click="save" v-close-popup)
    q-editor(v-if="field.type == 'richtext'" v-model="formData[field.name]")
  slot(name="extras")
  q-space
  .float-right.q-mb-md.q-mt-xl
    q-btn(@click="handleSubmit()" :label="props.submitBtn.text"  color="primary" :size="props.submitBtn.size || 'md'" :icon="props.submitBtn.icon || 'save'")
    span &nbsp
    q-btn(:label="props.extraBtn.text" :color="props.extraBtn.color" v-if="props.extraBtn.display" @click="actionExtra()" :size="props.submitBtn.size || 'md'" :icon="props.submitBtn.icon || 'close'")

    q-space
</template>

<script setup>
  import { onMounted, ref, onUnmounted } from 'vue';
  import { useValidator } from '../composables/validator.js';
  import { GlobalNotificator } from '../composables/notificator.js';
  import { xignus_locale } from '../composables/dateHandler';

  const filters = ref({});
  const filteredValues = ref({});
  const { validate, clearError, Errors, injectError, clearAllFormErrors } = useValidator();
  const formData = defineModel();
  const props = defineProps({
    fields: Array,
    actionSubmit: Function,
    actionError: Function,
    actionExtra: Function,
    formname: String,
    rules: Object,
    extraBtn: {
      type: Object,
      default(rawProps) {
        return {
          text: 'Cancelar',
          color: 'red',
          display: false
        }
      }
    },
    submitBtn: {
      type: Object,
      default(rawProps) {
        return {
          text: 'Enviar'
        }
      }
    }
  })

  const onRejected = (rejectedEntries, field) => {
    let errorText = '';
    if (rejectedEntries[0].failedPropValidation == 'max-file-size') {
      errorText = 'El archivo excede el tamaño maximo permitido.'
    }
    if (rejectedEntries[0].failedPropValidation == 'accept') {
      errorText = 'Formato de archivo no permitido.'
    }
    injectError(props.formname, field, errorText)
  }

  const filterFn = (val, update, field) => {
    let currentField = props.fields.filter(f => f.name == field)[0]
    update(() => {
      if (val === '') {
        filters.value[field] = currentField.options
      } else {
        const needle = val.toLowerCase();
        if (currentField.options.every((val) => typeof(val) == String)) {
          filters.value[field] = currentField.options.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        } else {
          filters.value[field] = currentField.options.filter(
            v => v.label.toLowerCase().indexOf(needle) > -1
          )
        }
      }
    })
  }

  const setFilterValues = (formname, field, value) => {
    clearError(formname, field);
    if (filteredValues.value[field]) {
      formData.value[field] = filteredValues.value[field].value;
    } else {
      formData.value[field] = value ?? false;
    }
    console.log(formData.value[field])
  }
  const handleSubmit = () => {
    validate(props.formname, formData.value, props.rules)
    if (Errors[props.formname].errors_data.count == 0) {
      GlobalNotificator('Enviando informacion', 'positive')
      props.actionSubmit && props.actionSubmit()
    } else {
      GlobalNotificator('Ha ocurrido un error, por favor revise los datos', 'negative')
      props.actionError && props.actionError()
    }
  }

  const initializeFilters = () => {
    props.fields.forEach(f => {
      if (f.type == 'selectfilter') {
        filters.value[f.name] = f.options;
        filteredValues.value[f.name] = null;
      }

      if (f.type == 'time') {
        formData.value[f.name] = new Date().toLocaleTimeString();
      }
    })
  }

  onMounted(() => {
    initializeFilters()
  })

 onUnmounted(() => {
   clearAllFormErrors(props.formname)
 })
</script>

<style lang="scss">

</style>
