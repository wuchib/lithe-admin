<script setup lang="ts">
import noisePng from '@/assets/noise.png'
import { useConfigureStore } from '@/stores/configure'

const configureStore = useConfigureStore()
</script>
<template>
  <div
    class="pointer-events-none fixed inset-0 z-[99998] size-full"
    :style="{
      backgroundImage: `url(${noisePng})`,
      opacity: configureStore.configure.noiseOpacity,
    }"
  />
</template>
