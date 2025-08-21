<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { isEmpty } from 'lodash-es'
import { NScrollbar } from 'naive-ui'
import { computed, provide, watch, ref } from 'vue'

import texturePng from '@/assets/texture.png'
import { EmptyPlaceholder } from '@/components'
import CollapseTransition from '@/components/CollapseTransition.vue'
import { useComponentThemeOverrides } from '@/composable/useComponentThemeOverrides'
import { mediaQueryInjectionKey, layoutInjectionKey } from '@/injection'
import { usePreferencesStore } from '@/stores'
import { useTabsStore } from '@/stores'

import AsideLayout from './aside/index.vue'
import MobileLeftAside from './aside/mobile/MobileLeftAside.vue'
import MobileRightAside from './aside/mobile/MobileRightAside.vue'
import Tabs from './component/Tabs.vue'
import FooterLayout from './footer/index.vue'
import HeaderLayout from './header/index.vue'
import MobileHeader from './header/mobile/MobileHeader.vue'
import MainLayout from './main/index.vue'

import type { LayoutSlideDirection } from '@/injection'

defineOptions({
  name: 'Layouts',
})

const tabsStore = useTabsStore()
const preferencesStore = usePreferencesStore()
const { scrollbarInMainLayout } = useComponentThemeOverrides()

const mediaQuery = {
  isSmallScreen: useMediaQuery('(max-width: 640px)'),
  isMediumScreen: useMediaQuery('(max-width: 768px)'),
  isLargeScreen: useMediaQuery('(max-width: 1024px)'),
  isExtraLargeScreen: useMediaQuery('(max-width: 1280px)'),
  isExtraExtraLargeScreen: useMediaQuery('(max-width: 1536px)'),
}

const layoutSlideDirection = ref<LayoutSlideDirection>(null)

const shouldRefreshRoute = ref(false)

const layoutTranslateOffset = computed(() => {
  return layoutSlideDirection.value === 'right'
    ? preferencesStore.preferences.menu.maxWidth || 0
    : layoutSlideDirection.value === 'left'
      ? -64
      : 0
})

function setLayoutSlideDirection(direction: LayoutSlideDirection) {
  layoutSlideDirection.value = direction === layoutSlideDirection.value ? null : direction
}

watch(
  () => mediaQuery.isSmallScreen.value,
  (isSm) => {
    if (isSm) {
      preferencesStore.modify({
        menu: {
          collapsed: false,
        },
      })
      setLayoutSlideDirection(null)
    }
  },
)

provide(mediaQueryInjectionKey, mediaQuery)

provide(layoutInjectionKey, {
  shouldRefreshRoute,
  layoutSlideDirection,
  setLayoutSlideDirection,
})
</script>
<template>
  <div
    class="relative flex h-svh overflow-hidden"
    :style="{ backgroundImage: `url(${texturePng})` }"
  >
    <MobileLeftAside v-if="mediaQuery.isSmallScreen.value" />

    <div
      class="relative flex h-full w-full flex-col border-naive-border bg-naive-card/50 transition-[background-color,border-color,rounded,transform]"
      :class="{
        'rounded-xl border': mediaQuery.isSmallScreen.value && layoutTranslateOffset,
      }"
      :style="
        mediaQuery.isSmallScreen.value &&
        layoutSlideDirection && {
          transform: `translate(${layoutTranslateOffset}px) scale(0.88)`,
        }
      "
    >
      <HeaderLayout v-if="!mediaQuery.isSmallScreen.value" />
      <MobileHeader v-else />
      <div class="flex flex-1 overflow-hidden">
        <AsideLayout v-if="!mediaQuery.isSmallScreen.value" />
        <div class="relative flex flex-1 flex-col overflow-x-hidden">
          <CollapseTransition
            :display="
              !mediaQuery.isSmallScreen.value &&
              !isEmpty(tabsStore.tabs) &&
              preferencesStore.preferences.showTabs
            "
            direction="horizontal"
            :render-content="false"
            container-class="shrink-0 items-baseline"
          >
            <Tabs />
          </CollapseTransition>
          <NScrollbar
            class="transition-[padding]"
            :class="{
              'pb-4': mediaQuery.isSmallScreen.value && layoutSlideDirection,
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
          <CollapseTransition
            :display="!mediaQuery.isSmallScreen.value && preferencesStore.preferences.showFooter"
            direction="horizontal"
            :render-content="false"
            container-class="shrink-0 items-baseline"
          >
            <FooterLayout />
          </CollapseTransition>
        </div>
      </div>
      <div
        v-if="mediaQuery.isSmallScreen.value && layoutSlideDirection"
        class="absolute inset-0"
        @click="setLayoutSlideDirection(null)"
      />
    </div>
    <MobileRightAside v-if="mediaQuery.isSmallScreen.value" />
  </div>
</template>
