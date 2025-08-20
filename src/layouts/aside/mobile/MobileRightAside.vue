<script setup lang="ts">
import { ButtonAnimationProvider } from '@/components'
import { useInjection } from '@/composable/useInjection'
import { layoutInjectionKey } from '@/injection'

import Actions from '../../header/actions/index.vue'

const { layoutSlideDirection } = useInjection(layoutInjectionKey)
</script>
<template>
  <div
    class="absolute top-0 right-0 h-svh p-4 transition-[translate]"
    :class="{
      'translate-x-full': layoutSlideDirection !== 'left',
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
