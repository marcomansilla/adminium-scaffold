<template lang="pug">
  q-dialog.x-dialog(v-model="props.isOpen")
    q-card
      q-card-section.row.items-center.q-pb-none.text-h6 {{props.title}}
      q-card-section
        slot(name="content")
      p {{props.title}}
</template>

<script setup>
  import { ref } from 'vue';
  const props = defineProps(['title', 'isOpen'])

  const open=ref(true)
</script>

<style lang="scss" >
  .q-dialog {
    min-width: 200px;
    min-height: 200px;
    &__backdrop {
      backdrop-filter: blur(5px) !important;
    }
  }
</style>