<script setup lang="ts">
import noisePng from '@/assets/noise.png'
import { useToRefsPreferences } from '@/stores'

const { noiseOpacity } = useToRefsPreferences()
</script>
<template>
  <div
    class="pointer-events-none fixed inset-0 z-[99998] size-full"
    :style="{
      backgroundImage: `url(${noisePng})`,
      opacity: noiseOpacity,
    }"
  />
</template>
