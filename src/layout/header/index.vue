<script setup lang="ts">
import CollapseTransition from '@/components/CollapseTransition.vue'
import { usePreferencesStore } from '@/stores'

import Actions from './actions/index.vue'
import Breadcrumb from './Breadcrumb.vue'
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
    <div class="flex flex-1 items-center p-4">
      <div class="flex flex-1 items-center">
        <CollapseTransition :display="preferencesStore.preferences.showNavigation">
          <Navigation />
        </CollapseTransition>
        <CollapseTransition
          :display="preferencesStore.preferences.showBreadcrumb"
          contentTag="nav"
        >
          <Breadcrumb />
        </CollapseTransition>
      </div>
      <Actions class="gap-x-3" />
    </div>
  </header>
</template>
