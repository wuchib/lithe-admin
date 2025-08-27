<script setup lang="tsx">
import { isFunction } from 'lodash-es'
import { NMenu, NScrollbar } from 'naive-ui'
import { h, ref, useTemplateRef, watch } from 'vue'

import router from '@/router'
import { usePreferencesStore, useUserStore } from '@/stores'

import type { MenuInst, MenuProps } from 'naive-ui'

const preferencesStore = usePreferencesStore()

const userStore = useUserStore()

const menuRef = useTemplateRef<MenuInst>('menuRef')

const menuActiveKey = ref('')

const renderIcon: MenuProps['renderIcon'] = (option) => {
  return isFunction(option.icon)
    ? h(option.icon, {
        class: 'size-5',
      })
    : null
}

watch(
  () => router.currentRoute.value,
  (newRoute) => {
    menuActiveKey.value = newRoute.name as string
    menuRef.value?.showOption(menuActiveKey.value)
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <NScrollbar>
    <NMenu
      ref="menuRef"
      :collapsed-width="preferencesStore.preferences.sidebarMenu.width"
      :collapsed="preferencesStore.preferences.sidebarMenu.collapsed"
      :collapsed-icon-size="20"
      :value="menuActiveKey"
      :options="userStore.menuList"
      :render-icon="renderIcon"
      :dropdown-props="{
        size: 'medium',
      }"
    />
  </NScrollbar>
</template>
