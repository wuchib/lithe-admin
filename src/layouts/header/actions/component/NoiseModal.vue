<script setup lang="ts">
import { NSlider, NInputNumber } from 'naive-ui'
import { reactive, ref, watchEffect } from 'vue'

import { usePreferencesStore } from '@/stores'

import type { SliderProps } from 'naive-ui'

const preferencesStore = usePreferencesStore()

const opacity = ref(0)

const sliderRange = reactive({
  step: 0.001,
  min: 0,
  max: 0.1,
})

const onSliderUpdata: SliderProps['onUpdateValue'] = (opacity) => {
  preferencesStore.modify({
    noiseOpacity: opacity,
  })
}

watchEffect(() => {
  opacity.value = preferencesStore.preferences.noiseOpacity
})
</script>
<template>
  <div class="flex flex-col gap-y-4 pt-6 pb-4">
    <NSlider
      v-model:value="opacity"
      v-bind="sliderRange"
      @update-value="onSliderUpdata"
    />
    <NInputNumber
      v-model:value="opacity"
      size="small"
      v-bind="sliderRange"
    />
  </div>
</template>
