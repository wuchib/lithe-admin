<script setup lang="ts">
import { ButtonAnimation } from '@/components'
import Logo from '@/components/Logo.vue'
import { useInjection } from '@/composable/useInjection'
import { layoutInjectionKey } from '@/injection'
import router from '@/router'

const { setLayoutSlideDirection } = useInjection(layoutInjectionKey)
</script>
<template>
  <div
    class="flex items-center justify-between px-4 py-2"
    @click="setLayoutSlideDirection(null)"
  >
    <div
      class="size-9"
      @click.stop="setLayoutSlideDirection('right')"
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
        @click="setLayoutSlideDirection('left')"
      >
        <span class="iconify ph--list" />
      </ButtonAnimation>
    </div>
  </div>
</template>
