<script setup lang="ts">
import { ButtonAnimation } from '@/components'
import Logo from '@/components/Logo.vue'
import router from '@/router'
import { usePreferencesStore } from '@/stores/preferences'

import type { LayoutSlideDirection } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()
const { setLayoutSlideDirection } = preferencesStore

const toggleLayoutSlideDirection = (direction: LayoutSlideDirection) => {
  setLayoutSlideDirection(direction === preferencesStore.layoutSlideDirection ? null : direction)
}
</script>
<template>
  <div
    class="flex items-center justify-between px-4 py-2"
    @click="toggleLayoutSlideDirection(null)"
  >
    <div
      class="size-8"
      @click.stop="toggleLayoutSlideDirection('right')"
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
      <ButtonAnimation
        size="large"
        @click="toggleLayoutSlideDirection('left')"
      >
        <span class="iconify ph--list" />
      </ButtonAnimation>
    </div>
  </div>
</template>
