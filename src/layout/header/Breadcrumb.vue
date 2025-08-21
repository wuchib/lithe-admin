<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { NDropdown } from 'naive-ui'
import { computed, h } from 'vue'

import router from '@/router'

import type { DropdownProps } from 'naive-ui'
import type { RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'

const routerBreadcrumb = computed(() => {
  return router.currentRoute.value.matched.filter((item) => item.name !== 'layouts')
})

function resolveDropdownOptions(route: RouteRecordRaw[]): DropdownProps['options'] {
  return route.map((item) => {
    return {
      label: item.meta?.title || item.meta?.label,
      key: (item.name as string) || item.path,
      icon: () => h('span', { class: `${item.meta?.icon} size-5` }),
      children: !isEmpty(item.children)
        ? resolveDropdownOptions(item.children as RouteRecordRaw[])
        : undefined,
    }
  })
}

const onDropdownSelected: DropdownProps['onSelect'] = (key) => {
  router.push({ name: key })
}

function isCurrentRoute(name: RouteRecordNameGeneric) {
  return name === router.currentRoute.value.name
}
</script>
<template>
  <TransitionGroup
    :duration="300"
    tag="ul"
    class="flex"
    type="transition"
    enter-active-class="transition-[grid-template-columns]"
    leave-active-class="transition-[grid-template-columns]"
    enter-from-class="grid-cols-[0fr]"
    leave-to-class="grid-cols-[0fr]"
    enter-to-class="grid-cols-[1fr]"
    leave-from-class="grid-cols-[1fr]"
  >
    <li
      v-for="item in routerBreadcrumb"
      :key="item.path"
      class="grid shrink-0 justify-start overflow-hidden"
    >
      <div
        class="flex min-w-0 items-center"
        :class="{
          'not-hover:text-[var(--text-color-3)]': !isCurrentRoute(item.name),
        }"
      >
        <NDropdown
          :options="resolveDropdownOptions(item.children)"
          placement="bottom-start"
          @select="onDropdownSelected"
        >
          <div
            class="flex shrink-0 items-center gap-x-1.5 rounded px-1.5 py-1 transition-[background-color,color]"
            :class="{
              'cursor-pointer hover:bg-[var(--button-color-2-hover)]': !isCurrentRoute(item.name),
            }"
          >
            <span
              v-if="item.meta?.icon"
              class="size-5"
              :class="item.meta?.icon"
            />
            {{ item.meta?.title }}
          </div>
        </NDropdown>
        <span
          class="iconify-[fluent--slash-forward-20-regular] w-3.5 text-[var(--text-color-3)]"
          v-if="!isCurrentRoute(item.name)"
        />
      </div>
    </li>
  </TransitionGroup>
</template>
