<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, h } from 'vue'

import { ButtonAnimation } from '@/components'
import { useInjection } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'
import { usePreferencesStore } from '@/stores'

import FullScreen from './FullScreen.vue'
import PreferencesDrawer from './PreferencesDrawer.vue'
import SignOut from './SignOut.vue'
import ThemePopselect from './ThemePopselect.vue'
defineOptions({
  name: 'Actions',
})

const AsyncAvatarDropdown = defineAsyncComponent({
  loader: () => import('./AvatarDropdown.vue'),
  loadingComponent: () => h('div', { style: { width: '34px', marginLeft: '4px' } }),
  delay: 0,
})

const { isSmallScreen } = useInjection(mediaQueryInjectionKey)
const { navigationMode } = storeToRefs(usePreferencesStore())
</script>
<template>
  <div class="flex items-center">
    <ButtonAnimation
      :animation="false"
      tag="a"
      href="https://github.com/tenianon/lithe-admin"
      target="_blank"
    >
      <span class="iconify-[mdi--github]" />
    </ButtonAnimation>
    <FullScreen />
    <ThemePopselect />
    <PreferencesDrawer />
    <SignOut />
    <AsyncAvatarDropdown v-if="!isSmallScreen && navigationMode === 'horizontal'" />
  </div>
</template>
