<script setup lang="ts">
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
import { RouterView } from 'vue-router'

import Noise from '@/components/Noise.vue'
import { getConfigProviderProps } from '@/composable/useDiscreteApi'
import { usePreferencesStore } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()
const configProviderProps = getConfigProviderProps()
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
                v-if="preferencesStore.preferences.showWatermark"
                fullscreen
                v-bind="preferencesStore.preferences.watermarkOptions"
              />
              <Noise v-if="preferencesStore.preferences.showNoise" />
            </NDialogProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NModalProvider>
    </NEl>
  </NConfigProvider>
</template>
