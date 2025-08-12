<script setup lang="ts">
import { NMenu, NScrollbar } from 'naive-ui'
import { ref, useTemplateRef, watch } from 'vue'

import router from '@/router'
import { usePreferencesStore } from '@/stores/preferences'
import { useUserStore } from '@/stores/user'

import type { MenuInst } from 'naive-ui'

const preferencesStore = usePreferencesStore()

const userStore = useUserStore()

const menuRef = useTemplateRef<MenuInst>('menuRef')

const menuActiveKey = ref('')

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
      :collapsed-width="preferencesStore.preferences.menu.width"
      :collapsed="preferencesStore.preferences.menu.collapsed"
      :collapsed-icon-size="20"
      :value="menuActiveKey"
      :options="userStore.menuList"
    />
  </NScrollbar>
</template>
