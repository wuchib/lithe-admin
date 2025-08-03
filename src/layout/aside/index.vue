<script setup lang="ts">
import { computed, inject } from 'vue'

import { menuInjectionKey } from '@/injection'
import { useConfigureStore } from '@/stores/configure'

import Menu from './component/Menu.vue'
import UserCard from './component/UserCard.vue'

defineOptions({
  name: 'AsideLayout',
})

const menuInject = inject(menuInjectionKey, null)

const configureStore = useConfigureStore()

const menuCollapseWidth = computed(() =>
  configureStore.configure.menuCollapsed
    ? menuInject?.collapse.width
    : menuInject?.collapse.maxWidth,
)

function handleCollapseClick() {
  configureStore.modify({ menuCollapsed: !configureStore.configure.menuCollapsed })
}
</script>
<template>
  <div
    class="relative flex h-full flex-col justify-between gap-y-4 border-r border-naive-border bg-naive-card transition-[background-color,border-color,width] duration-300 ease-naive-bezier"
    :style="{
      width: `${menuCollapseWidth}px`,
    }"
  >
    <Menu />
    <UserCard />
    <div
      class="absolute top-1/2 right-0 z-50 grid size-6 translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-naive-border bg-white transition-[background-color,border-color] duration-300 ease-naive-bezier hover:bg-neutral-50 dark:bg-neutral-750 dark:hover:bg-neutral-700"
      @click="handleCollapseClick"
    >
      <span
        class="iconify size-4.5 transition-[color,rotate] duration-300 ease-naive-bezier ph--caret-left dark:text-neutral-400"
        :class="{
          'rotate-180': configureStore.configure.menuCollapsed,
        }"
      />
    </div>
  </div>
</template>
