<script setup lang="ts">
import { defineAsyncComponent, provide, ref } from 'vue'

import { CollapseTransition } from '@/components'
import { headerLayoutInjectionKey } from '@/injection'
import { usePreferencesStore } from '@/stores'

defineOptions({
  name: 'Navigation',
})

const AsyncNavigationButton = defineAsyncComponent(() => import('./NavigationButton.vue'))
const AsyncHorizontalMenu = defineAsyncComponent(() => import('./HorizontalMenu.vue'))
const AsyncBreadcrumb = defineAsyncComponent(() => import('./Breadcrumb.vue'))

const preferencesStore = usePreferencesStore()

const navigationContainerRef = ref<HTMLElement | null>(null)

provide(headerLayoutInjectionKey, {
  navigationContainerElement: navigationContainerRef,
})
</script>
<template>
  <nav
    ref="navigationContainerRef"
    class="flex h-9 flex-1 items-center"
  >
    <CollapseTransition
      :display="
        preferencesStore.preferences.showNavigation &&
        preferencesStore.preferences.navigationMode === 'sidebar'
      "
    >
      <AsyncNavigationButton />
    </CollapseTransition>
    <CollapseTransition
      :display="
        preferencesStore.preferences.showBreadcrumb &&
        preferencesStore.preferences.navigationMode === 'sidebar'
      "
    >
      <AsyncBreadcrumb />
    </CollapseTransition>
    <CollapseTransition :display="preferencesStore.preferences.navigationMode === 'horizontal'">
      <AsyncHorizontalMenu />
    </CollapseTransition>
  </nav>
</template>
<style></style>
