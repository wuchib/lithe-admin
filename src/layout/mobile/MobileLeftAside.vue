<script setup lang="ts">
import { useInjection } from '@/composables'
import { layoutInjectionKey } from '@/injection'

import SidebarMenu from '../aside/SidebarMenu.vue'
import SidebarUserPanel from '../aside/SidebarUserPanel.vue'
import Logo from '../header/logo/index.vue'

const { layoutSlideDirection } = useInjection(layoutInjectionKey)
</script>
<template>
  <div
    class="absolute top-0 left-0 flex h-svh flex-col gap-y-4 pt-6 pb-4 transition-[translate]"
    :class="{
      '-translate-x-full': layoutSlideDirection !== 'right',
    }"
  >
    <Logo />
    <SidebarMenu />
    <SidebarUserPanel />
  </div>
</template>
