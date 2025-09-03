<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { usePreferencesStore, DEFAULT_PREFERENCES_OPTIONS } from '@/stores'

import SidebarMenu from './SidebarMenu.vue'
import SidebarUserPanel from './SidebarUserPanel.vue'

defineOptions({
  name: 'AsideLayout',
})

const preferencesStore = usePreferencesStore()
const { modify } = preferencesStore
const { sidebarMenu } = storeToRefs(preferencesStore)

const menuCollapseWidth = computed(() => {
  return sidebarMenu.value.collapsed
    ? sidebarMenu.value.width || DEFAULT_PREFERENCES_OPTIONS.sidebarMenu.width
    : sidebarMenu.value.maxWidth || DEFAULT_PREFERENCES_OPTIONS.sidebarMenu.maxWidth
})

function handleCollapseClick() {
  modify({
    sidebarMenu: {
      collapsed: !sidebarMenu.value.collapsed,
    },
  })
}
</script>
<template>
  <aside
    class="relative flex h-full flex-col justify-between gap-y-4 border-r border-naive-border bg-naive-card pb-4 transition-[background-color,border-color,width]"
    :style="{
      width: `${menuCollapseWidth + 1}px`,
    }"
  >
    <SidebarMenu />
    <SidebarUserPanel />
    <div
      class="absolute top-1/2 right-0 z-50 grid size-6 translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-naive-border bg-white transition-[background-color,border-color] hover:bg-neutral-50 dark:bg-neutral-750 dark:hover:bg-neutral-700"
      @click="handleCollapseClick"
    >
      <span
        class="iconify size-4.5 transition-[color,rotate] ph--caret-left dark:text-neutral-400"
        :class="{
          'rotate-180': sidebarMenu.collapsed,
        }"
      />
    </div>
  </aside>
</template>
