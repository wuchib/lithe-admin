<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { nextTick, ref, watch } from 'vue'

import Logo from '@/components/AppLogo.vue'
import { usePreferencesStore, DEFAULT_PREFERENCES_OPTIONS } from '@/stores'

defineOptions({
  name: 'Logo',
})

const APP_NAME = import.meta.env.VITE_APP_NAME

const { navigationMode, sidebarMenu, showLogo } = storeToRefs(usePreferencesStore())

const logoAreaWrapRef = ref<HTMLElement | null>(null)

const collapseWidth = ref(0)

watch(
  [() => navigationMode.value, () => sidebarMenu.value.collapsed],
  ([navigationMode, isCollapsed]) => {
    if (navigationMode === 'horizontal') {
      nextTick(() => {
        collapseWidth.value = logoAreaWrapRef.value?.clientWidth ?? 0
      })
    } else {
      const { width, maxWidth } = sidebarMenu.value
      const { width: defaultWidth, maxWidth: defaultMaxWidth } =
        DEFAULT_PREFERENCES_OPTIONS.sidebarMenu
      collapseWidth.value = isCollapsed ? width || defaultWidth : maxWidth || defaultMaxWidth
    }
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <div
    class="shrink-0 transition-[width]"
    :style="
      collapseWidth > 0 && {
        width: `${collapseWidth}px`,
      }
    "
  >
    <div
      ref="logoAreaWrapRef"
      class="flex h-full items-center transition-[opacity,padding]"
      :class="[
        sidebarMenu.collapsed ? 'px-3' : 'px-4',
        {
          'opacity-0': !showLogo,
          'w-fit': navigationMode === 'horizontal',
        },
      ]"
    >
      <div class="size-10">
        <Logo />
      </div>
      <div
        class="flex flex-1 overflow-hidden transition-[margin-left,max-width]"
        :class="sidebarMenu.collapsed ? 'ml-0 max-w-0' : 'ml-4 max-w-44'"
      >
        <h1 class="shrink-0 text-xl">
          {{ APP_NAME }}
        </h1>
      </div>
    </div>
  </div>
</template>
