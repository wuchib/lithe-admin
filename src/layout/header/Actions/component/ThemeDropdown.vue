<script setup lang="ts">
import { NPopselect } from 'naive-ui'
import { computed, h, ref } from 'vue'

import { ButtonAnimation } from '@/components'
import { usePersonalization } from '@/composable/usePersonalization'

import type { Theme } from '@/composable/usePersonalization'

const { setTheme, theme } = usePersonalization()

const themeKey = ref(theme.value)

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

const themeIconName = computed(
  () =>
    themeDropdownOptions.find((item) => item.key === theme.value)?.iconName ||
    'iconify ph--desktop',
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
    trigger="click"
    v-model:value="themeKey"
    :options="themeDropdownOptions"
    :render-label="renderSelectLabel"
    show-arrow
    :to="false"
    @update-value="onThemePopselectUpdated"
  >
    <ButtonAnimation title="主题">
      <span
        :class="themeIconName"
        class="size-5"
      />
    </ButtonAnimation>
  </NPopselect>
</template>
