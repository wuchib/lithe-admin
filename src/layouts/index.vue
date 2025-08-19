<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { isEmpty } from 'lodash-es'
import { NScrollbar } from 'naive-ui'
import { computed, provide, watch } from 'vue'

import texturePng from '@/assets/texture.png'
import { EmptyPlaceholder } from '@/components'
import { useComponentThemeOverrides } from '@/composable/useComponentThemeOverrides'
import { mediaQueryInjectionKey } from '@/injection'
import { usePreferencesStore } from '@/stores/preferences'
import { useTabsStore } from '@/stores/tabs'

import AsideLayout from './aside/index.vue'
import MobileLeftAside from './aside/mobile/MobileLeftAside.vue'
import MobileRightAside from './aside/mobile/MobileRightAside.vue'
import Tabs from './component/Tabs.vue'
import FooterLayout from './footer/index.vue'
import HeaderLayout from './header/index.vue'
import MainLayout from './main/index.vue'

defineOptions({
  name: 'Layout',
})

const tabsStore = useTabsStore()
const preferencesStore = usePreferencesStore()
const { scrollbarInMainLayout } = useComponentThemeOverrides()

const mediaQuery = {
  sm: useMediaQuery('(max-width: 640px)'),
  md: useMediaQuery('(max-width: 768px)'),
  lg: useMediaQuery('(max-width: 1024px)'),
  xl: useMediaQuery('(max-width: 1280px)'),
  '2xl': useMediaQuery('(max-width: 1536px)'),
}

const mobileLayoutTranslateOffset = computed(() => {
  return preferencesStore.layoutSlideDirection === 'right'
    ? preferencesStore.preferences.menu.maxWidth || 0
    : preferencesStore.layoutSlideDirection === 'left'
      ? -62
      : 0
})

watch(
  () => mediaQuery.sm.value,
  (isMaxSm) => {
    if (isMaxSm) {
      preferencesStore.modify({
        menu: {
          collapsed: false,
        },
      })
      preferencesStore.setLayoutSlideDirection(null)
    }
  },
)

provide(mediaQueryInjectionKey, mediaQuery)
</script>
<template>
  <div
    class="relative flex h-svh overflow-hidden"
    :style="{ backgroundImage: `url(${texturePng})` }"
  >
    <MobileLeftAside v-if="mediaQuery.sm.value" />
    <div
      class="relative flex h-full w-full flex-col border-naive-border transition-[border-color,rounded,transform] max-sm:rounded-xl sm:transform-none!"
      :class="{
        'overflow-hidden rounded-xl border': mediaQuery.sm.value && mobileLayoutTranslateOffset,
      }"
      :style="
        mediaQuery.sm.value && preferencesStore.layoutSlideDirection
          ? {
              transform: `translate(${mobileLayoutTranslateOffset}px) scale(0.88)`,
            }
          : null
      "
    >
      <HeaderLayout />
      <div class="flex flex-1 overflow-hidden">
        <AsideLayout v-if="!mediaQuery.sm.value" />
        <div class="relative flex flex-1 flex-col overflow-x-hidden">
          <Transition
            type="transition"
            enter-active-class="transition-[grid-template-rows]"
            leave-active-class="transition-[grid-template-rows]"
            enter-from-class="grid-rows-[0fr]"
            leave-to-class="grid-rows-[0fr]"
            enter-to-class="grid-rows-[1fr]"
            leave-from-class="grid-rows-[1fr]"
          >
            <div
              v-if="
                !mediaQuery.sm.value &&
                !isEmpty(tabsStore.tabs) &&
                preferencesStore.preferences.showTabs
              "
              class="grid shrink-0 items-baseline overflow-hidden"
            >
              <Tabs />
            </div>
          </Transition>
          <NScrollbar
            class="transition-[padding]"
            :class="{
              'pb-4': mediaQuery.sm.value && preferencesStore.layoutSlideDirection,
            }"
            container-class="main-container"
            :theme-overrides="scrollbarInMainLayout"
          >
            <MainLayout />
          </NScrollbar>
          <EmptyPlaceholder
            :show="isEmpty(tabsStore.tabs)"
            description="空标签页"
            size="huge"
          >
            <template #icon>
              <div class="flex items-center justify-center">
                <span class="iconify ph--rectangle" />
              </div>
            </template>
          </EmptyPlaceholder>
          <Transition
            type="transition"
            enter-active-class="transition-[grid-template-rows]"
            leave-active-class="transition-[grid-template-rows]"
            enter-from-class="grid-rows-[0fr]"
            leave-to-class="grid-rows-[0fr]"
            enter-to-class="grid-rows-[1fr]"
            leave-from-class="grid-rows-[1fr]"
          >
            <div
              v-if="!mediaQuery.sm.value && preferencesStore.preferences.showFooter"
              class="grid shrink-0 items-baseline overflow-hidden"
            >
              <FooterLayout />
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <MobileRightAside v-if="mediaQuery.sm.value" />
  </div>
</template>
