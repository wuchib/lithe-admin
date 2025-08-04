<script setup lang="ts">
import { ButtonAnimation } from '@/components'

import ConfigureDrawer from './component/ConfigureDrawer.vue'
import FullScreen from './component/FullScreen.vue'
import Signout from './component/SignOut.vue'
import ThemeDropdown from './component/ThemeDropdown.vue'

defineOptions({
  name: 'Actions',
})
</script>
<template>
  <div class="flex items-center gap-x-3">
    <ButtonAnimation
      :animation="false"
      tag="a"
      href="https://github.com/tenianon/lithe-admin"
      target="_blank"
    >
      <span class="iconify-[mdi--github] size-5" />
    </ButtonAnimation>
    <FullScreen />
    <ThemeDropdown />
    <ConfigureDrawer />
    <Signout />
  </div>
</template>
