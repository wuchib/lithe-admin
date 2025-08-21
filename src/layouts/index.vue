<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { NScrollbar } from 'naive-ui'
import { computed, watch } from 'vue'

import texturePng from '@/assets/texture.png'
import { CollapseTransition, EmptyPlaceholder } from '@/components'
import { useComponentThemeOverrides, useInjection } from '@/composable'
import { mediaQueryInjectionKey, layoutInjectionKey } from '@/injection'
import { usePreferencesStore, useTabsStore } from '@/stores'

import AsideLayout from './aside/index.vue'
import MobileLeftAside from './aside/mobile/MobileLeftAside.vue'
import MobileRightAside from './aside/mobile/MobileRightAside.vue'
import Tabs from './component/Tabs.vue'
import FooterLayout from './footer/index.vue'
import HeaderLayout from './header/index.vue'
import MobileHeader from './header/mobile/MobileHeader.vue'
import MainLayout from './main/index.vue'

defineOptions({
  name: 'Layouts',
})

const tabsStore = useTabsStore()
const preferencesStore = usePreferencesStore()
const { scrollbarInMainLayout } = useComponentThemeOverrides()
const { isSmallScreen } = useInjection(mediaQueryInjectionKey)
const { layoutSlideDirection, setLayoutSlideDirection } = useInjection(layoutInjectionKey)

const layoutTranslateOffset = computed(() => {
  return layoutSlideDirection.value === 'right'
    ? preferencesStore.preferences.menu.maxWidth || 0
    : layoutSlideDirection.value === 'left'
      ? -64
      : 0
})

watch(
  () => isSmallScreen.value,
  (isSmallScreen) => {
    if (isSmallScreen) {
      preferencesStore.modify({
        menu: {
          collapsed: false,
        },
      })
      setLayoutSlideDirection(null)
    }
  },
)
</script>
<template>
  <div
    class="relative flex h-svh overflow-hidden"
    :style="{ backgroundImage: `url(${texturePng})` }"
  >
    <MobileLeftAside v-if="isSmallScreen" />

    <div
      class="relative flex h-full w-full flex-col border-naive-border bg-naive-card/50 transition-[background-color,border-color,rounded,transform]"
      :class="{
        'rounded-xl border': isSmallScreen && layoutTranslateOffset,
      }"
      :style="
        isSmallScreen &&
        layoutSlideDirection && {
          transform: `translate(${layoutTranslateOffset}px) scale(0.88)`,
        }
      "
    >
      <HeaderLayout v-if="!isSmallScreen" />
      <MobileHeader v-else />
      <div class="flex flex-1 overflow-hidden">
        <AsideLayout v-if="!isSmallScreen" />
        <div class="relative flex flex-1 flex-col overflow-x-hidden">
          <CollapseTransition
            :display="
              !isSmallScreen && !isEmpty(tabsStore.tabs) && preferencesStore.preferences.showTabs
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
              'pb-4': isSmallScreen && layoutSlideDirection,
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
            :display="!isSmallScreen && preferencesStore.preferences.showFooter"
            direction="horizontal"
            :render-content="false"
            container-class="shrink-0 items-baseline"
          >
            <FooterLayout />
          </CollapseTransition>
        </div>
      </div>
      <div
        v-if="isSmallScreen && layoutSlideDirection"
        class="absolute inset-0"
        @click="setLayoutSlideDirection(null)"
      />
    </div>
    <MobileRightAside v-if="isSmallScreen" />
  </div>
</template>
