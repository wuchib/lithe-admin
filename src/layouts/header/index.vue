<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences'

import Actions from './Actions/index.vue'
import Breadcrumb from './Breadcrumb.vue'
import Logo from './Logo.vue'
import Navigation from './Navigation.vue'

defineOptions({
  name: 'HeaderLayout',
})

const preferencesStore = usePreferencesStore()
</script>
<template>
  <header class="flex">
    <Logo />
    <div class="flex flex-1 items-center p-4">
      <div class="flex flex-1 items-center">
        <Transition
          type="transition"
          enter-active-class="transition-[grid-template-columns]"
          leave-active-class="transition-[grid-template-columns]"
          enter-from-class="grid-cols-[0fr]"
          leave-to-class="grid-cols-[0fr]"
          enter-to-class="grid-cols-[1fr]"
          leave-from-class="grid-cols-[1fr]"
        >
          <div
            v-if="preferencesStore.preferences.showNavigation"
            class="grid overflow-hidden"
          >
            <Navigation />
          </div>
        </Transition>

        <Transition
          type="transition"
          enter-active-class="transition-[grid-template-columns]"
          leave-active-class="transition-[grid-template-columns]"
          enter-from-class="grid-cols-[0fr]"
          leave-to-class="grid-cols-[0fr]"
          enter-to-class="grid-cols-[1fr]"
          leave-from-class="grid-cols-[1fr]"
        >
          <div
            v-if="preferencesStore.preferences.showBreadcrumb"
            class="grid overflow-hidden"
          >
            <Breadcrumb />
          </div>
        </Transition>
      </div>
      <Actions />
    </div>
  </header>
</template>
