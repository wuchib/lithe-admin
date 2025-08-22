<script setup lang="ts">
import { NPopselect } from 'naive-ui'
import { computed, h } from 'vue'

import { ButtonAnimation } from '@/components'
import { usePersonalization } from '@/composables'

import type { Theme } from '@/composables'
import type { PopoverProps } from 'naive-ui'

const props = defineProps</* @vue-ignore */ PopoverProps>()

const { setTheme, theme } = usePersonalization()

const themeDropdownOptions = [
  {
    icon: () => h('span', { class: 'iconify ph--sun size-5' }),
    iconName: 'iconify ph--sun',
    key: 'light',
    value: 'light',
    label: '浅色模式',
  },
  {
    icon: () => h('span', { class: 'iconify ph--moon size-5' }),
    iconName: 'iconify ph--moon',
    key: 'dark',
    value: 'dark',
    label: '深色模式',
  },
  {
    icon: () => h('span', { class: 'iconify ph--desktop size-5' }),
    iconName: 'iconify ph--desktop',
    key: 'system',
    value: 'system',
    label: '跟随系统',
  },
]

const themeIconClasses = computed(
  () =>
    themeDropdownOptions.find((item) => item.key === theme.value)?.iconName ||
    'iconify ph--desktop size-5',
)

const onThemePopselectUpdated = (key: Theme) => {
  if (key === theme.value) return

  setTheme(key)
}

function renderSelectLabel(option: (typeof themeDropdownOptions)[number]) {
  return h(
    'div',
    {
      class: 'flex items-center gap-x-2',
    },
    [option.icon(), option.label],
  )
}
</script>
<template>
  <NPopselect
    v-bind="props"
    trigger="click"
    v-model:value="theme"
    :options="themeDropdownOptions"
    :render-label="renderSelectLabel"
    :to="false"
    @update-value="onThemePopselectUpdated"
  >
    <ButtonAnimation title="主题">
      <span :class="themeIconClasses" />
    </ButtonAnimation>
  </NPopselect>
</template>
