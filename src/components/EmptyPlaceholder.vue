<script setup lang="ts">
import { NEmpty } from 'naive-ui'

import type { EmptyProps } from 'naive-ui'

export interface EmptyPlaceholderProps extends /* @vue-ignore */ EmptyProps {
  show?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<EmptyPlaceholderProps>()
</script>
<template>
  <Transition
    type="transition"
    enter-active-class="transition-[opacity,scale]"
    enter-from-class="scale-50 opacity-0"
  >
    <div
      v-show="props.show"
      class="absolute inset-0 grid size-full place-items-center"
    >
      <NEmpty v-bind="$attrs">
        <template
          v-for="slot of $slots"
          :key="slot"
          #[slot]
        >
          <slot :name="slot" />
        </template>
      </NEmpty>
    </div>
  </Transition>
</template>
