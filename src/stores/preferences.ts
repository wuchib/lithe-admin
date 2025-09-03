import { useStorage } from '@vueuse/core'
import { mergeWith } from 'lodash-es'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, watch, type ComputedRef } from 'vue'

import type { WatermarkProps } from 'naive-ui'

type NavigationMode = 'sidebar' | 'horizontal'

export interface PreferencesOptions {
  navigationMode: NavigationMode
  sidebarMenu: Partial<{
    collapsed: boolean
    width: number
    maxWidth: number
  }>
  showFooter: boolean
  showLogo: boolean
  showTabs: boolean
  showTabClose: boolean
  showNavigationButton: boolean
  showBreadcrumb: boolean
  showWatermark: boolean
  showNoise: boolean
  showTopLoadingBar: boolean
  enableNavigationTransition: boolean
  enableTextSelect: boolean
  watermarkOptions: Partial<WatermarkProps>
  noiseOpacity: number
}

export const DEFAULT_PREFERENCES_OPTIONS = {
  navigationMode: 'sidebar',
  sidebarMenu: {
    collapsed: false,
    width: 64,
    maxWidth: 256,
  },
  showFooter: true,
  showTabs: true,
  showTabClose: true,
  showLogo: true,
  showNoise: true,
  showWatermark: false,
  showNavigationButton: true,
  showBreadcrumb: true,
  showTopLoadingBar: true,
  enableNavigationTransition: true,
  enableTextSelect: true,
  watermarkOptions: {
    content: 'Watermark',
    fontColor: '#D81E1E96',
    fontSize: 16,
    width: 384,
    height: 384,
    xGap: 0,
    yGap: 0,
    xOffset: 12,
    yOffset: 60,
    globalRotate: 0,
    rotate: -20,
    textAlign: 'center',
    cross: true,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 16,
    image: '',
    imageHeight: 64,
    imageWidth: 64,
    imageOpacity: 0.5,
  },
  noiseOpacity: 0.02,
} as const

export const usePreferencesStore = defineStore('preferencesStore', () => {
  const preferences = useStorage<PreferencesOptions>('preferences', DEFAULT_PREFERENCES_OPTIONS)

  const computedPreferences = Object.fromEntries(
    Object.entries(preferences.value).map(([key]) => [
      key,
      computed(() => preferences.value[key as keyof PreferencesOptions]),
    ]),
  ) as { [K in keyof PreferencesOptions]: ComputedRef<PreferencesOptions[K]> }

  const modify = (options: Partial<PreferencesOptions>) => {
    preferences.value = mergeWith({}, preferences.value, options, (objValue, srcValue) => {
      if (Array.isArray(objValue) && Array.isArray(srcValue)) {
        return srcValue
      }
    })
  }

  const reset = () => {
    preferences.value = structuredClone(DEFAULT_PREFERENCES_OPTIONS)
  }

  watch(
    () => preferences.value.enableTextSelect,
    (newValue) => {
      document.documentElement.style.userSelect = newValue ? 'auto' : 'none'
    },
    {
      immediate: true,
    },
  )

  return {
    preferences,
    ...computedPreferences,
    reset,
    modify,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePreferencesStore, import.meta.hot))
}
