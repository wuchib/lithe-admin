<script setup lang="ts">
import { storeToRefs } from 'pinia'
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

const { showNavigation, showBreadcrumb, navigationMode } = storeToRefs(usePreferencesStore())

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
    <CollapseTransition :display="showNavigation && navigationMode === 'sidebar'">
      <AsyncNavigationButton />
    </CollapseTransition>
    <CollapseTransition :display="showBreadcrumb && navigationMode === 'sidebar'">
      <AsyncBreadcrumb />
    </CollapseTransition>
    <CollapseTransition :display="navigationMode === 'horizontal'">
      <AsyncHorizontalMenu />
    </CollapseTransition>
  </nav>
</template>
<style></style>
