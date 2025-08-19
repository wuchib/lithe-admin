<script setup lang="ts">
import { inject } from 'vue'

import { mediaQueryInjectionKey } from '@/injection'
import { usePreferencesStore } from '@/stores'

import Actions from './actions/index.vue'
import Breadcrumb from './Breadcrumb.vue'
import LogoArea from './LogoArea.vue'
import MobileHeader from './mobile/MobileHeader.vue'
import Navigation from './Navigation.vue'

defineOptions({
  name: 'HeaderLayout',
})

const preferencesStore = usePreferencesStore()
const mediaQueryInjection = inject(mediaQueryInjectionKey)
</script>
<template>
  <header
    class="border-b border-naive-border bg-naive-card transition-[background-color,border-color]"
  >
    <div
      v-if="!mediaQueryInjection?.sm"
      class="flex"
    >
      <LogoArea />
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
        <Actions class="gap-x-3" />
      </div>
    </div>
    <MobileHeader v-else />
  </header>
</template>
