<script setup lang="ts">
import noisePng from '@/assets/noise.png'
import { usePreferencesStore } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()
</script>
<template>
  <div
    class="pointer-events-none fixed inset-0 z-[99998] size-full"
    :style="{
      backgroundImage: `url(${noisePng})`,
      opacity: preferencesStore.preferences.noiseOpacity,
    }"
  />
</template>
