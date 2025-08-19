<script setup lang="ts">
import { ButtonAnimationProvider } from '@/components'
import { usePreferencesStore } from '@/stores/preferences'

import Actions from '../../header/actions/index.vue'

const preferencesStore = usePreferencesStore()
</script>
<template>
  <div
    class="absolute top-0 right-0 h-svh p-4 transition-[translate]"
    :class="{
      'translate-x-full': preferencesStore.layoutSlideDirection !== 'left',
    }"
  >
    <div class="flex h-full items-center justify-between">
      <ButtonAnimationProvider
        size="large"
        :circle="false"
      >
        <Actions class="flex-col justify-center gap-y-4" />
      </ButtonAnimationProvider>
    </div>
  </div>
</template>
