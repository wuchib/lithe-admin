<script setup lang="ts">
import { useConfigureStore } from '@/stores/configure'

import Actions from './Actions/index.vue'
import Breadcrumb from './Breadcrumb.vue'
import Logo from './Logo.vue'
import Navigation from './Navigation.vue'

defineOptions({
  name: 'HeaderLayout',
})

const configureStore = useConfigureStore()
</script>
<template>
  <header class="flex">
    <Logo />
    <div class="flex flex-1 items-center p-4">
      <div class="flex flex-1 items-center">
        <Transition
          enter-active-class="transition-[grid-template-columns] duration-300 ease-naive-bezier"
          leave-active-class="transition-[grid-template-columns] duration-300 ease-naive-bezier"
          enter-from-class="grid-cols-[0fr]"
          leave-to-class="grid-cols-[0fr]"
          enter-to-class="grid-cols-[1fr]"
          leave-from-class="grid-cols-[1fr]"
        >
          <div
            v-if="configureStore.configure.showNavigation"
            class="grid overflow-hidden"
          >
            <Navigation />
          </div>
        </Transition>

        <Transition
          enter-active-class="transition-[grid-template-columns] duration-300 ease-naive-bezier"
          leave-active-class="transition-[grid-template-columns] duration-300 ease-naive-bezier"
          enter-from-class="grid-cols-[0fr]"
          leave-to-class="grid-cols-[0fr]"
          enter-to-class="grid-cols-[1fr]"
          leave-from-class="grid-cols-[1fr]"
        >
          <div
            v-if="configureStore.configure.showBreadcrumb"
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
