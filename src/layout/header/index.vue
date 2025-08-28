<script setup lang="ts">
import { defineAsyncComponent, provide, ref } from 'vue'

import { CollapseTransition } from '@/components'
import { headerLayoutInjectionKey } from '@/injection'
import { usePreferencesStore } from '@/stores'

import Actions from './actions/index.vue'
import AvatarDropdown from './AvatarDropdown.vue'
import LogoArea from './LogoArea.vue'

defineOptions({
  name: 'HeaderLayout',
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
  <header
    class="flex border-b border-naive-border bg-naive-card transition-[background-color,border-color]"
  >
    <LogoArea />
    <div class="flex flex-1 items-center px-4 py-3.5">
      <div
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
          contentTag="nav"
        >
          <AsyncBreadcrumb />
        </CollapseTransition>
        <CollapseTransition :display="preferencesStore.preferences.navigationMode === 'horizontal'">
          <AsyncHorizontalMenu />
        </CollapseTransition>
      </div>
      <Actions class="gap-x-3 pl-4" />
      <AvatarDropdown v-if="preferencesStore.preferences.navigationMode === 'horizontal'" />
    </div>
  </header>
</template>
