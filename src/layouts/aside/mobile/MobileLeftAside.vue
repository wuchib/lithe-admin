<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences'

import LogoArea from '../../header/LogoArea.vue'
import Menu from '../component/Menu.vue'
import UserCard from '../component/UserCard.vue'

const preferencesStore = usePreferencesStore()
</script>
<template>
  <div
    class="absolute top-0 left-0 flex h-svh flex-col gap-y-4 py-4 transition-[translate] sm:hidden"
    :class="{
      '-translate-x-full': preferencesStore.preferences.mobile.mainLayoutSlider !== 'right',
    }"
  >
    <LogoArea />
    <Menu />
    <UserCard />
  </div>
</template>
