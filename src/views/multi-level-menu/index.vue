<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<template>
  <div class="p-4">
    <div class="flex h-96 items-center justify-center text-3xl">
      {{ route.meta.title }}
    </div>
  </div>
</template>
