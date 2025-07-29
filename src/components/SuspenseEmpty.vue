<script setup lang="ts">
import { NEmpty } from 'naive-ui'

import type { EmptyProps, EmptySlots } from 'naive-ui'
import type { VNode } from 'vue'

export interface SuspenseEmptyProps extends /* @vue-ignore */ EmptyProps {
  show?: boolean
}

export interface SuspenseEmptySlots extends EmptySlots {
  content?: () => VNode[]
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<SuspenseEmptyProps>()

const slots = defineSlots<SuspenseEmptySlots>()

function getSuspenseEmptySlots() {
  return (Object.keys(slots) as (keyof SuspenseEmptySlots)[]).filter((name) => name !== 'content')
}
</script>
<template>
  <Transition
    enter-active-class="transition-[opacity,scale] duration-300 ease-naive-bezier"
    enter-from-class="scale-50 opacity-0"
  >
    <div
      v-if="props.show"
      class="absolute inset-0 grid size-full place-items-center"
    >
      <NEmpty v-bind="$attrs">
        <template
          v-for="slot of getSuspenseEmptySlots()"
          :key="slot"
          #[slot]
        >
          <slot :name="slot" />
        </template>
      </NEmpty>
    </div>
  </Transition>
  <slot name="content" />
</template>
