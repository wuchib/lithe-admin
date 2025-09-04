<script setup lang="ts">
import { defineAsyncComponent, provide, useTemplateRef } from 'vue'

import { CollapseTransition } from '@/components'
import { headerLayoutInjectionKey } from '@/injection'
import { useToRefsPreferences } from '@/stores'

defineOptions({
  name: 'Navigation',
})

const AsyncNavigationButton = defineAsyncComponent(() => import('./NavigationButton.vue'))
const AsyncHorizontalMenu = defineAsyncComponent(() => import('./HorizontalMenu.vue'))
const AsyncBreadcrumb = defineAsyncComponent(() => import('./Breadcrumb.vue'))

const { showNavigationButton, showBreadcrumb, navigationMode } = useToRefsPreferences()

const navigationContainerRef = useTemplateRef<HTMLElement>('navigationContainer')

provide(headerLayoutInjectionKey, {
  navigationContainerElement: navigationContainerRef,
})
</script>
<template>
  <nav
    ref="navigationContainer"
    class="flex h-9 flex-1 items-center"
  >
    <CollapseTransition :display="showNavigationButton && navigationMode === 'sidebar'">
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
