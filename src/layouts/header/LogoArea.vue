<script setup lang="ts">
import { computed } from 'vue'

import Logo from '@/components/Logo.vue'
import { usePreferencesStore } from '@/stores/preferences'

const APP_NAME = import.meta.env.VITE_APP_NAME

const preferencesStore = usePreferencesStore()

const collapseWidth = computed(() => {
  return preferencesStore.preferences.menu.collapsed
    ? preferencesStore.preferences.menu.width
    : preferencesStore.preferences.menu.maxWidth
})
</script>
<template>
  <div
    class="shrink-0 border-r border-naive-border transition-[border-color,width] max-sm:border-0"
    :style="{
      width: `${collapseWidth}px`,
    }"
  >
    <div
      class="flex h-full items-center justify-center transition-[opacity,padding]"
      :class="[
        preferencesStore.preferences.menu.collapsed ? 'px-0' : 'px-4',
        {
          'opacity-0': !preferencesStore.preferences.showLogo,
        },
      ]"
    >
      <div class="size-10">
        <Logo />
      </div>
      <div
        class="flex-1 overflow-hidden transition-[margin-left,max-width]"
        :class="preferencesStore.preferences.menu.collapsed ? 'ml-0 max-w-0' : 'ml-4 max-w-44'"
      >
        <h1 class="truncate text-xl">
          {{ APP_NAME }}
        </h1>
      </div>
    </div>
  </div>
</template>
