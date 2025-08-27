<script setup lang="ts">
import { CollapseTransition } from '@/components'
import { usePreferencesStore } from '@/stores'

import Actions from './actions/index.vue'
import AvatarDropdown from './AvatarDropdown.vue'
import Breadcrumb from './Breadcrumb.vue'
import HorizontalMenu from './HorizontalMenu.vue'
import LogoArea from './LogoArea.vue'
import Navigation from './Navigation.vue'

defineOptions({
  name: 'HeaderLayout',
})

const preferencesStore = usePreferencesStore()
</script>
<template>
  <header
    class="flex border-b border-naive-border bg-naive-card transition-[background-color,border-color]"
  >
    <LogoArea />
    <div class="flex flex-1 items-center px-4 py-3.5">
      <div class="flex h-9 flex-1 items-center">
        <CollapseTransition
          :display="
            preferencesStore.preferences.showNavigation &&
            preferencesStore.preferences.navigationMode === 'sidebar'
          "
        >
          <Navigation />
        </CollapseTransition>
        <CollapseTransition
          :display="
            preferencesStore.preferences.showBreadcrumb &&
            preferencesStore.preferences.navigationMode === 'sidebar'
          "
          contentTag="nav"
        >
          <Breadcrumb />
        </CollapseTransition>
        <CollapseTransition :display="preferencesStore.preferences.navigationMode === 'horizontal'">
          <HorizontalMenu />
        </CollapseTransition>
      </div>
      <Actions class="gap-x-3 pl-4" />
      <AvatarDropdown v-if="preferencesStore.preferences.navigationMode === 'horizontal'" />
    </div>
  </header>
</template>
