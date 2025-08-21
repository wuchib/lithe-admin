<script setup lang="ts">
import type { CSSProperties, TransitionProps } from 'vue'

interface CollapseTransitionProps extends TransitionProps {
  displayDirective?: 'if' | 'show'
  display?: boolean
  direction?: 'vertical' | 'horizontal'
  transitionDuration?: number
  containerClass?: string
  containerStyle?: CSSProperties
  renderContent?: boolean
  contentTag?: string
  contentClass?: string
  contentStyle?: CSSProperties
}

const {
  direction = 'vertical',
  type = 'transition',
  displayDirective = 'if',
  display,
  transitionDuration,
  contentTag = 'div',
  renderContent = true,
  contentClass,
  contentStyle,
  containerClass,
  containerStyle,
} = defineProps<CollapseTransitionProps>()

const BASE_CLASSES = {
  vertical: {
    activeClass: 'transition-[grid-template-columns]',
    fromClass: 'grid-cols-[0fr]',
    toClass: 'grid-cols-[1fr]',
    contentClass: 'min-w-0',
  },
  horizontal: {
    activeClass: 'transition-[grid-template-rows]',
    fromClass: 'grid-rows-[0fr]',
    toClass: 'grid-rows-[1fr]',
    contentClass: 'min-h-0',
  },
}
</script>
<template>
  <Transition
    :type="type"
    :enter-active-class="BASE_CLASSES[direction].activeClass"
    :leave-active-class="BASE_CLASSES[direction].activeClass"
    :enter-from-class="BASE_CLASSES[direction].fromClass"
    :leave-to-class="BASE_CLASSES[direction].fromClass"
    :enter-to-class="BASE_CLASSES[direction].toClass"
    :leave-from-class="BASE_CLASSES[direction].toClass"
    v-bind="$attrs"
  >
    <div
      v-if="displayDirective === 'if' ? display : true"
      v-show="displayDirective === 'show' ? display : true"
      class="grid overflow-hidden"
      :class="containerClass"
      :style="[
        typeof transitionDuration === 'number' &&
          transitionDuration > 0 && {
            '--default-transition-duration': `${transitionDuration}ms`,
          },
        containerStyle,
      ]"
    >
      <component
        v-if="renderContent"
        :is="contentTag"
        :class="[BASE_CLASSES[direction].contentClass, contentClass]"
        :style="contentStyle"
      >
        <slot />
      </component>
      <slot v-else />
    </div>
  </Transition>
</template>
