<script setup lang="ts">
import { useInjection } from '@/composable'
import { layoutInjectionKey } from '@/injection'

import LogoArea from '../../header/LogoArea.vue'
import Menu from '../component/Menu.vue'
import UserCard from '../component/UserCard.vue'

const { layoutSlideDirection } = useInjection(layoutInjectionKey)
</script>
<template>
  <div
    class="absolute top-0 left-0 flex h-svh flex-col gap-y-4 pt-6 pb-4 transition-[translate]"
    :class="{
      '-translate-x-full': layoutSlideDirection !== 'right',
    }"
  >
    <LogoArea />
    <Menu />
    <UserCard />
  </div>
</template>
