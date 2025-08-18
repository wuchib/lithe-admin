<script setup lang="ts">
import { ButtonAnimation } from '@/components'

import FullScreen from './component/FullScreen.vue'
import PreferencesDrawer from './component/PreferencesDrawer.vue'
import SignOut from './component/SignOut.vue'
import ThemeDropdown from './component/ThemeDropdown.vue'

defineOptions({
  name: 'Actions',
})
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
    <ThemeDropdown />
    <PreferencesDrawer />
    <SignOut />
  </div>
</template>
