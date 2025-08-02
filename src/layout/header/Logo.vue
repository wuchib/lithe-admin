<script setup lang="ts">
import { computed, inject } from 'vue'

import { menuInjectionKey } from '@/injection'
import { useConfigureStore } from '@/stores/configure'

const APP_NAME = import.meta.env.VITE_APP_NAME

const menuInject = inject(menuInjectionKey, null)

const configureStore = useConfigureStore()

const collapseWidth = computed(() => {
  return configureStore.configure.menuCollapsed
    ? menuInject?.collapse.width
    : menuInject?.collapse.maxWidth
})
</script>
<template>
  <div
    class="shrink-0 border-r border-naive-border transition-[border-color,width] duration-300 ease-naive-bezier"
    :style="{
      width: `${collapseWidth}px`,
    }"
  >
    <div
      class="flex items-center justify-center py-4 transition-[opacity,padding] duration-300 ease-naive-bezier"
      :class="[
        configureStore.configure.menuCollapsed ? 'px-0' : 'px-4',
        {
          'opacity-0': !configureStore.configure.showLogo,
        },
      ]"
    >
      <div class="size-10 shrink-0">
        <div class="size-full rounded bg-primary/10"></div>
      </div>
      <div
        class="flex-1 overflow-hidden transition-[margin-left,max-width] duration-300"
        :class="configureStore.configure.menuCollapsed ? 'ml-0 max-w-0' : 'ml-4 max-w-44'"
      >
        <h1 class="truncate text-xl">
          {{ APP_NAME }}
        </h1>
      </div>
    </div>
  </div>
</template>
