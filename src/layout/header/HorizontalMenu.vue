<script setup lang="ts">
import { useElementSize, watchThrottled } from '@vueuse/core'
import { isFunction, isEmpty } from 'lodash-es'
import { NDropdown } from 'naive-ui'
import { h, computed, ref, watch, nextTick, onBeforeUnmount, reactive } from 'vue'

import { useInjection } from '@/composables'
import { headerLayoutInjectionKey } from '@/injection'
import router from '@/router'
import { useUserStore } from '@/stores'

import type { DropdownProps, MenuProps } from 'naive-ui'
import type { ComponentPublicInstance } from 'vue'

type Key = string | number | undefined

const MENU = {
  MORE_BUTTON_WIDTH: 44,
  ITEM_COLUMN_GAP: 4,
  BOUNDARY_OFFSET: 1,
}

let rafId: number | null = null

let initialized = false

const userStore = useUserStore()

const { navigationContainerElement } = useInjection(headerLayoutInjectionKey)

const { width: containerWidth, stop: stopObserveContainerWidth } = useElementSize(
  navigationContainerElement,
)

const navigationWrapperRef = ref<HTMLElement | null>(null)

const menuActiveKey = ref('')

const menuRightBoundMap = reactive(new Map<Key, number>())

const threshold = ref(Number.POSITIVE_INFINITY)

const moreDropdownOptions = computed<DropdownProps['options']>(() => {
  return (userStore.menuList as NonNullable<MenuProps['options']>).filter((item: any) => {
    if (item?.type) return false
    const menuRightBound = menuRightBoundMap.get(item.key) ?? 0
    return menuRightBound + MENU.ITEM_COLUMN_GAP > threshold.value
  })
})

const hasActiveChild = computed(() => {
  if (!Array.isArray(moreDropdownOptions.value)) return false
  const stack = [...moreDropdownOptions.value]
  while (stack.length) {
    const node = stack.pop()
    if (node?.key === menuActiveKey.value) return true
    if (Array.isArray(node?.children)) {
      stack.push(...node.children)
    }
  }
  return false
})

const shouldShowMore = computed(
  () => Array.isArray(moreDropdownOptions.value) && !isEmpty(moreDropdownOptions.value),
)

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
      rect.right - (navigationWrapperRef.value?.getBoundingClientRect().left ?? 0),
    )
    scheduleUpdateMenuVisibility()
  })
}

function updateMenuVisibility(containerWidth: number) {
  if (containerWidth <= 0) return
  const widthWithoutMore = containerWidth + MENU.BOUNDARY_OFFSET
  const widthWithMore = containerWidth - MENU.MORE_BUTTON_WIDTH + MENU.BOUNDARY_OFFSET

  let shouldComputeMoreWidth = false
  for (const rightBound of menuRightBoundMap.values()) {
    if (rightBound + MENU.ITEM_COLUMN_GAP > widthWithoutMore) {
      shouldComputeMoreWidth = true
      break
    }
  }

  threshold.value = shouldComputeMoreWidth ? widthWithMore : widthWithoutMore
}

function scheduleUpdateMenuVisibility() {
  if (rafId != null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    updateMenuVisibility(containerWidth.value)
    if (!initialized) initialized = true
  })
}

function isMenuVisibleByKey(key: Key) {
  const menuRightBound = menuRightBoundMap.get(key) ?? 0
  return menuRightBound + MENU.ITEM_COLUMN_GAP <= threshold.value
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

watchThrottled(
  containerWidth,
  (width) => {
    if (!initialized) return
    updateMenuVisibility(width)
  },
  {
    throttle: 100,
  },
)

onBeforeUnmount(() => {
  stopObserveContainerWidth()
})
</script>
<template>
  <div
    ref="navigationWrapperRef"
    class="relative flex items-center overflow-hidden"
    :style="{
      columnGap: `${MENU.ITEM_COLUMN_GAP}px`,
    }"
  >
    <template
      v-for="{ disabled, key, type, label, icon, children } in userStore.menuList"
      :key="key"
    >
      <div
        v-if="!type"
        :ref="(ref) => forwardRef(key, ref)"
        v-show="isMenuVisibleByKey(key)"
        class="shrink-0 rounded-naive transition-[background-color,color]"
        :class="[
          {
            'relative flex items-center px-2.5 py-2': isEmpty(children),
          },
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          menuActiveKey === key || hasActiveChild
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
      :disabled="!shouldShowMore"
      :render-icon="renderIcon"
      size="large"
    >
      <div
        v-show="shouldShowMore"
        class="flex shrink-0 cursor-pointer items-center rounded-naive px-3 py-2 leading-4 font-medium transition-[background-color,color]"
        :class="[
          hasActiveChild
            ? 'bg-primary/15 text-primary'
            : 'hover:bg-neutral-150 dark:hover:bg-neutral-800',
        ]"
      >
        <span class="iconify size-5 ph--dots-three-circle-vertical" />
      </div>
    </NDropdown>
  </div>
</template>
