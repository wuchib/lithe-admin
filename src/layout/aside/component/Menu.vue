<script setup lang="ts">
import { NMenu, NScrollbar } from 'naive-ui'
import { inject, ref, useTemplateRef, watch } from 'vue'

import { menuInjectionKey } from '@/injection'
import router from '@/router'
import { useConfigureStore } from '@/stores/configure'
import { useUserStore } from '@/stores/user'

import type { MenuInst } from 'naive-ui'

const menuInject = inject(menuInjectionKey, null)

const configureStore = useConfigureStore()

const userStore = useUserStore()

const menuRef = useTemplateRef<MenuInst>('menuRef')

const menuActiveKey = ref('')

watch(
  () => router.currentRoute.value,
  (newValue) => {
    menuActiveKey.value = newValue.name as string

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
      :collapsed-width="menuInject?.collapse.width"
      :collapsed="configureStore.configure.menuCollapsed"
      :collapsed-icon-size="20"
      :value="menuActiveKey"
      :options="userStore.userMenu"
    />
  </NScrollbar>
</template>
