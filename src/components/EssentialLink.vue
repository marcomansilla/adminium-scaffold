<template lang="pug">
q-expansion-item(v-if="props.submenu.length" :label="props.title" :icon="props.icon")
  q-list
    q-item.q-pl-xl(v-for="option in props.submenu" clickable="" tag="a" :to="option.link")
      q-item-section(v-if="option.icon" avatar="")
        q-icon(:name="option.icon")
      q-item-section
        q-item-label
          | {{ option.title }}
        q-item-label(caption="")
          span.text-gray1 {{ option.caption }}
q-item(v-else clickable="" tag="a" :to="props.link")
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
   },

   submenu: {
     type: Array,
     default: []
   }
 })
</script>
