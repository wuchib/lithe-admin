<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { computed, useTemplateRef, watch } from 'vue'

import { useInjection } from '@/composables'
import { layoutInjectionKey } from '@/injection'
import { toRefsPreferencesStore, DEFAULT_PREFERENCES_OPTIONS } from '@/stores'

import SidebarMenu from './SidebarMenu.vue'
import SidebarUserPanel from './SidebarUserPanel.vue'

defineOptions({
  name: 'AsideLayout',
})

const { preferences, sidebarMenu } = toRefsPreferencesStore()

const { isSidebarColResizing } = useInjection(layoutInjectionKey)

const sidelineRef = useTemplateRef<HTMLDivElement>('sidebarLine')

const { x } = useDraggable(sidelineRef, {})

const menuCollapseWidth = computed(() => {
  return sidebarMenu.value.collapsed
    ? sidebarMenu.value.width || DEFAULT_PREFERENCES_OPTIONS.sidebarMenu.width
    : sidebarMenu.value.maxWidth || DEFAULT_PREFERENCES_OPTIONS.sidebarMenu.maxWidth
})

function handleCollapseClick() {
  preferences.value.sidebarMenu.collapsed = !sidebarMenu.value.collapsed
}

const onSidelineMouseDown = () => {
  isSidebarColResizing.value = true
  document.documentElement.style.userSelect = 'none'
  document.addEventListener(
    'mouseup',
    () => {
      isSidebarColResizing.value = false
      document.documentElement.style.userSelect = 'auto'
    },
    {
      once: true,
    },
  )
}

watch(x, (newX) => {
  console.log(newX)
})
</script>
<template>
  <div class="flex h-full">
    <aside
      class="relative flex h-full flex-col justify-between gap-y-4 bg-naive-card pb-4"
      :class="{
        'transition-[background-color,width]': !isSidebarColResizing,
      }"
      :style="{
        width: `${menuCollapseWidth}px`,
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
    <div class="relative flex h-full justify-center border-r border-naive-border">
      <div
        ref="sidebarLine"
        class="absolute z-10 h-full w-[5px] cursor-col-resize"
        @mousedown="onSidelineMouseDown"
      ></div>
    </div>
  </div>
</template>
