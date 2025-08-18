<script setup lang="ts">
import { provide, reactive } from 'vue'

import { usePreferencesStore } from '@/stores/preferences'

import Actions from '../../header/actions/index.vue'

import type { ButtonProps } from 'naive-ui'

const preferencesStore = usePreferencesStore()

const provideButtonAnimation = reactive<ButtonProps>({
  size: 'large',
  circle: false,
})

provide('ButtonAnimationInject', provideButtonAnimation)
</script>
<template>
  <div
    class="absolute top-0 right-0 h-svh p-4 transition-[translate] sm:hidden"
    :class="{
      'translate-x-full': preferencesStore.preferences.mobile.mainLayoutSlider !== 'left',
    }"
  >
    <div class="flex h-full items-center justify-between">
      <Actions class="flex-col justify-center gap-y-4" />
    </div>
  </div>
</template>
