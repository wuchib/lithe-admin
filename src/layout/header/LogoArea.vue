<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import Logo from '@/components/Logo.vue'
import { usePreferencesStore, DEFAULT_PREFERENCES_OPTIONS } from '@/stores'

const APP_NAME = import.meta.env.VITE_APP_NAME

const preferencesStore = usePreferencesStore()

const logoAreaWrapRef = ref<HTMLElement | null>(null)

const collapseWidth = ref(0)

watch(
  () => [
    preferencesStore.preferences.navigationMode,
    preferencesStore.preferences.sidebarMenu.collapsed,
  ],
  ([navigationMode, isCollapsed]) => {
    if (navigationMode === 'horizontal') {
      nextTick(() => {
        collapseWidth.value = logoAreaWrapRef.value?.clientWidth ?? 0
      })
    } else {
      const { width, maxWidth } = preferencesStore.preferences.sidebarMenu
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
    class="shrink-0 border-r transition-[border-color,width] max-sm:border-0"
    :style="
      collapseWidth > 0 && {
        width: `${collapseWidth}px`,
      }
    "
    :class="
      preferencesStore.preferences.navigationMode === 'sidebar'
        ? 'border-naive-border'
        : 'border-transparent'
    "
  >
    <div
      ref="logoAreaWrapRef"
      class="flex h-full items-center transition-[opacity,padding]"
      :class="[
        preferencesStore.preferences.sidebarMenu.collapsed ? 'px-3' : 'px-4',
        {
          'opacity-0': !preferencesStore.preferences.showLogo,
          'w-fit': preferencesStore.preferences.navigationMode === 'horizontal',
        },
      ]"
    >
      <div class="size-10">
        <Logo />
      </div>
      <div
        class="flex flex-1 overflow-hidden transition-[margin-left,max-width]"
        :class="
          preferencesStore.preferences.sidebarMenu.collapsed ? 'ml-0 max-w-0' : 'ml-4 max-w-44'
        "
      >
        <h1 class="shrink-0 text-xl">
          {{ APP_NAME }}
        </h1>
      </div>
    </div>
  </div>
</template>
