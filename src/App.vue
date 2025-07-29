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
import { useConfigureStore } from '@/stores/configure'

const configureStore = useConfigureStore()
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
                v-if="configureStore.configure.showWatermark"
                fullscreen
                v-bind="configureStore.configure.watermarkOptions"
              />
              <Noise v-if="configureStore.configure.showNoise" />
            </NDialogProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NModalProvider>
    </NEl>
  </NConfigProvider>
</template>
