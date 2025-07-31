<script setup lang="ts">
import { NEmpty } from 'naive-ui'

import type { EmptyProps, EmptySlots } from 'naive-ui'
import type { VNode } from 'vue'

export interface EmptyPlaceholderProps extends /* @vue-ignore */ EmptyProps {
  show?: boolean
}

export interface EmptyPlaceholderSlots extends EmptySlots {
  content?: () => VNode[]
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<EmptyPlaceholderProps>()

const slots = defineSlots<EmptyPlaceholderSlots>()

function getEmptySlots() {
  return (Object.keys(slots) as (keyof EmptyPlaceholderSlots)[]).filter(
    (name) => name !== 'content',
  )
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
          v-for="slot of getEmptySlots()"
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
