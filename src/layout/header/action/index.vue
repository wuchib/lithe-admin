<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

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

const AsyncAvatarDropdown = defineAsyncComponent(() => import('./AvatarDropdown.vue'))

const { isSmallScreen } = useInjection(mediaQueryInjectionKey)

const preferencesStore = usePreferencesStore()
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
    <AsyncAvatarDropdown
      v-if="!isSmallScreen && preferencesStore.preferences.navigationMode === 'horizontal'"
    />
  </div>
</template>
