<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import {
  NConfigProvider,
  NModalProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NWatermark,
  NGlobalStyle,
  NEl,
} from 'naive-ui'
import { storeToRefs } from 'pinia'
import { provide, ref } from 'vue'
import { RouterView } from 'vue-router'

import Noise from '@/components/Noise.vue'
import { getConfigProviderProps } from '@/composables'
import { usePreferencesStore } from '@/stores'

import { layoutInjectionKey, mediaQueryInjectionKey } from './injection'

import type { LayoutSlideDirection } from './injection'

const { showWatermark, showNoise, watermarkOptions } = storeToRefs(usePreferencesStore())
const configProviderProps = getConfigProviderProps()

const mediaQuery = {
  isSmallScreen: useMediaQuery('(max-width: 640px)'),
  isMediumScreen: useMediaQuery('(max-width: 768px)'),
  isLargeScreen: useMediaQuery('(max-width: 1024px)'),
  isExtraLargeScreen: useMediaQuery('(max-width: 1280px)'),
  isExtraExtraLargeScreen: useMediaQuery('(max-width: 1536px)'),
}

const layoutSlideDirection = ref<LayoutSlideDirection>(null)

const shouldRefreshRoute = ref(false)

function setLayoutSlideDirection(direction: LayoutSlideDirection) {
  layoutSlideDirection.value = direction === layoutSlideDirection.value ? null : direction
}
provide(mediaQueryInjectionKey, mediaQuery)

provide(layoutInjectionKey, {
  shouldRefreshRoute,
  layoutSlideDirection,
  setLayoutSlideDirection,
})
</script>

<template>
  <NConfigProvider v-bind="configProviderProps">
    <NGlobalStyle />
    <NEl>
      <NModalProvider>
        <NNotificationProvider placement="bottom-right">
          <NMessageProvider>
            <NDialogProvider>
              <RouterView />
              <NWatermark
                v-if="showWatermark"
                fullscreen
                v-bind="watermarkOptions"
              />
              <Noise v-if="showNoise" />
            </NDialogProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NModalProvider>
    </NEl>
  </NConfigProvider>
</template>
