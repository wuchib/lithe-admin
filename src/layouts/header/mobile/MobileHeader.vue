<script setup lang="ts">
import { ButtonAnimation } from '@/components'
import Logo from '@/components/Logo.vue'
import router from '@/router'
import { usePreferencesStore } from '@/stores/preferences'

import type { PreferencesOptions } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()
const { modify } = preferencesStore

const mainLayoutSliderToRight = (direction: PreferencesOptions['mobile']['mainLayoutSlider']) => {
  modify({
    mobile: {
      mainLayoutSlider:
        preferencesStore.preferences.mobile.mainLayoutSlider === direction ? null : direction,
    },
  })
}
</script>
<template>
  <div class="flex items-center justify-between px-4 py-3 sm:hidden">
    <div
      class="size-9"
      @click="mainLayoutSliderToRight('right')"
    >
      <Logo />
    </div>
    <div class="flex items-center gap-x-2">
      <span
        class="size-6"
        :class="router.currentRoute.value.meta.icon"
      />
      <span class="text-base">{{ router.currentRoute.value.meta.title }}</span>
    </div>
    <div class="flex items-center gap-x-2">
      <ButtonAnimation @click="mainLayoutSliderToRight('left')">
        <span class="iconify ph--list" />
      </ButtonAnimation>
    </div>
  </div>
</template>
