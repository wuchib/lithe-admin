import { useStorage } from '@vueuse/core'
import { mergeWith } from 'lodash-es'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { watch } from 'vue'

import type { WatermarkProps } from 'naive-ui'

export interface PreferencesOptions {
  menu: Partial<{
    collapsed: boolean
    width: number
    maxWidth: number
  }>
  shouldRefreshTab: boolean
  showFooter: boolean
  showLogo: boolean
  showTabs: boolean
  showTabClose: boolean
  showNavigation: boolean
  showBreadcrumb: boolean
  showWatermark: boolean
  showNoise: boolean
  showTopLoadingBar: boolean
  enableNavigationTransition: boolean
  enableTextSelect: boolean
  watermarkOptions: Partial<WatermarkProps>
  noiseOpacity: number
}

const DEFAULT_PREFERENCES_OPTIONS: PreferencesOptions = {
  menu: {
    collapsed: false,
    width: 64,
    maxWidth: 272,
  },
  shouldRefreshTab: false,
  showFooter: true,
  showTabs: true,
  showTabClose: true,
  showLogo: true,
  showNoise: true,
  showWatermark: false,
  showNavigation: true,
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
    image: undefined,
    imageHeight: 64,
    imageWidth: 64,
    imageOpacity: 0.5,
  },
  noiseOpacity: 0.02,
}

export const usePreferencesStore = defineStore('preferencesStore', () => {
  const preferences = useStorage<PreferencesOptions>('preferences', DEFAULT_PREFERENCES_OPTIONS)

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
    reset,
    modify,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePreferencesStore, import.meta.hot))
}
