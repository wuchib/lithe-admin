<script setup lang="ts">
import { NSlider, NInputNumber } from 'naive-ui'
import { reactive, ref } from 'vue'

import { usePreferencesStore } from '@/stores'

import type { SliderProps } from 'naive-ui'

const preferencesStore = usePreferencesStore()
const { modify } = preferencesStore

const opacity = ref(preferencesStore.noiseOpacity)

const sliderRange = reactive({
  step: 0.001,
  min: 0,
  max: 0.1,
})

const onSliderUpdate: SliderProps['onUpdateValue'] = (value) => {
  modify({
    noiseOpacity: value,
  })
}
</script>
<template>
  <div class="flex flex-col gap-y-4 pt-6 pb-4">
    <NSlider
      v-model:value="opacity"
      v-bind="sliderRange"
      @update-value="onSliderUpdate"
    />
    <NInputNumber
      v-model:value="opacity"
      size="small"
      v-bind="sliderRange"
    />
  </div>
</template>
