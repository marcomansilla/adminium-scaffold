<template lang="pug">
q-item(clickable="" tag="a" :to="props.link")
  q-item-section(v-if="props.icon" avatar="")
    q-icon(:name="props.icon")
  q-item-section
    q-item-label
      | {{ props.title }}
    q-item-label(caption="")
      span.text-gray1 {{ props.caption }}
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: '#'
  },

  icon: {
    type: String,
    default: ''
  }
})
</script>
