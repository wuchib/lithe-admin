<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { isFunction, isEmpty } from 'lodash-es'
import { NDropdown } from 'naive-ui'
import { h, computed, ref, watch, nextTick, onBeforeUnmount } from 'vue'

import { useInjection } from '@/composables'
import { headerLayoutInjectionKey } from '@/injection'
import router from '@/router'
import { useUserStore } from '@/stores'

import type { DropdownProps, MenuProps } from 'naive-ui'
import type { ComponentPublicInstance } from 'vue'

type Key = string | number | undefined

const MENU_SIZE = {
  MORE_BUTTON: 44,
  ITEM_COLUMN_GAP: 4,
  BOUNDARY_OFFSET: 1,
}

const userStore = useUserStore()

const { navigationContainerElement } = useInjection(headerLayoutInjectionKey)

const { width: containerWidth, stop: stopObserveContainerWidth } = useElementSize(
  navigationContainerElement,
)

const navigationWrapperRef = ref<HTMLElement | null>(null)

const menuActiveKey = ref('')

const menuRightBoundMap = new Map<Key, number>()

const partiallyVisibleMenuKeys = ref<Set<Key>>(new Set())

const moreDropdownOptions = computed<DropdownProps['options']>(() => {
  return (userStore.menuList as NonNullable<MenuProps['options']>).filter((item) =>
    partiallyVisibleMenuKeys.value.has(item.key),
  )
})

const renderIcon: DropdownProps['renderIcon'] = (option) => {
  return isFunction(option.icon)
    ? h(option.icon, {
        class: 'ml-1.5 size-5',
      })
    : null
}

function forwardRef(key: Key, ref: Element | ComponentPublicInstance | null) {
  if (!key || !ref || menuRightBoundMap.has(key)) return
  nextTick(() => {
    const rect = (ref as HTMLElement).getBoundingClientRect()
    menuRightBoundMap.set(
      key,
      rect.right - navigationWrapperRef.value!.getBoundingClientRect().left,
    )
  })
}

function updateMenuVisibility(containerWidth: number) {
  if (containerWidth <= 0) return
  for (const [key, rightBound] of menuRightBoundMap.entries()) {
    if (
      rightBound + MENU_SIZE.ITEM_COLUMN_GAP >
      containerWidth - MENU_SIZE.MORE_BUTTON + MENU_SIZE.BOUNDARY_OFFSET
    ) {
      partiallyVisibleMenuKeys.value.add(key)
    } else {
      partiallyVisibleMenuKeys.value.delete(key)
    }
  }
}

function hasActiveChild(children: any[]): boolean {
  const stack = [...children]
  while (stack.length) {
    const node = stack.pop()
    if (node?.key === menuActiveKey.value) return true
    if (Array.isArray(node?.children)) {
      stack.push(...node.children)
    }
  }
  return false
}

watch(
  () => router.currentRoute.value,
  (newRoute) => {
    menuActiveKey.value = newRoute.name as string
  },
  {
    immediate: true,
  },
)

watch(containerWidth, (width) => {
  updateMenuVisibility(width)
})

onBeforeUnmount(() => {
  stopObserveContainerWidth()
})
</script>
<template>
  <div
    ref="navigationWrapperRef"
    class="relative flex items-center overflow-hidden"
    :style="{
      columnGap: `${MENU_SIZE.ITEM_COLUMN_GAP}px`,
    }"
  >
    <template
      v-for="{ disabled, key, type, label, icon, children } in userStore.menuList"
      :key="key"
    >
      <div
        v-if="!type"
        :ref="(ref) => forwardRef(key, ref)"
        v-show="!partiallyVisibleMenuKeys.has(key)"
        class="shrink-0 rounded-naive transition-[background-color,color]"
        :class="[
          {
            'relative flex items-center px-2.5 py-2': isEmpty(children),
          },
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          menuActiveKey === key || (Array.isArray(children) && hasActiveChild(children))
            ? 'bg-primary/15 text-primary'
            : 'hover:bg-neutral-150 dark:hover:bg-neutral-800',
        ]"
      >
        <template v-if="Array.isArray(children) && !isEmpty(children)">
          <NDropdown
            :options="children"
            :value="menuActiveKey"
            :disabled="disabled"
            :render-icon="renderIcon"
          >
            <div class="flex items-center py-2 pr-2 pl-2.5">
              <component
                v-if="icon"
                :is="icon"
                class="mr-2 size-5"
              />
              <span class="leading-4">{{ label }}</span>
              <span class="ml-1.5 iconify ph--caret-down" />
            </div>
          </NDropdown>
        </template>
        <template v-else>
          <component
            v-if="icon"
            :is="icon"
            class="mr-2 size-5"
          />
          <component
            v-if="isFunction(label)"
            :is="label"
            class="leading-4 before:absolute before:inset-0 before:size-full before:content-['']"
          />
          <span
            v-else
            class="leading-4"
            >{{ label }}</span
          >
        </template>
      </div>
    </template>

    <NDropdown
      :options="moreDropdownOptions"
      :value="menuActiveKey"
      :disabled="isEmpty(moreDropdownOptions)"
      :render-icon="renderIcon"
      size="large"
    >
      <div
        v-show="!isEmpty(partiallyVisibleMenuKeys)"
        class="flex shrink-0 cursor-pointer items-center rounded-naive px-3 py-2 leading-4 font-medium transition-[background-color,color]"
        :class="[
          Array.isArray(moreDropdownOptions) && hasActiveChild(moreDropdownOptions)
            ? 'bg-primary/15 text-primary'
            : 'hover:bg-neutral-150 dark:hover:bg-neutral-800',
        ]"
      >
        <span class="iconify size-5 ph--dots-three-circle-vertical" />
      </div>
    </NDropdown>
  </div>
</template>
