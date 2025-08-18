import { useStorage } from '@vueuse/core'
import { mergeWith, flatMapDeep, keys, sortBy, isEqual, isPlainObject } from 'lodash-es'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { useTabsStore } from './tabs'
import { useUserStore } from './user'

import type { WatermarkProps } from 'naive-ui'

export type LayoutSlideDirection = 'left' | 'right' | null

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

function getAllKeys(obj: Record<string, any>, prefix = ''): string[] {
  return flatMapDeep(keys(obj), (key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    return isPlainObject(obj[key])
      ? [fullKey, ...getAllKeys(obj[key] as Record<string, any>, fullKey)]
      : fullKey
  })
}

function haveSameKeys<T extends object, U extends object>(a: T, b: U): boolean {
  const keysA = sortBy(getAllKeys(a as Record<string, any>))
  const keysB = sortBy(getAllKeys(b as Record<string, any>))
  return isEqual(keysA, keysB)
}

export const usePreferencesStore = defineStore('preferencesStore', () => {
  const preferences = useStorage<PreferencesOptions>('preferences', DEFAULT_PREFERENCES_OPTIONS)

  const layoutSlideDirection = ref<LayoutSlideDirection>(null)

  const modify = (options: Partial<PreferencesOptions>) => {
    preferences.value = mergeWith({}, preferences.value, options, (objValue, srcValue) => {
      if (Array.isArray(objValue) && Array.isArray(srcValue)) {
        return srcValue
      }
    })
  }

  const setLayoutSlideDirection = (direction: LayoutSlideDirection) => {
    layoutSlideDirection.value = direction
  }

  const reset = () => {
    preferences.value = structuredClone(DEFAULT_PREFERENCES_OPTIONS)
  }

  const oldLocalStorage = localStorage.getItem('configure')
  if (oldLocalStorage || haveSameKeys(preferences.value, DEFAULT_PREFERENCES_OPTIONS)) {
    useTabsStore().clearTabs()
    reset()
    useUserStore().cleanup()
    localStorage.clear()
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
    layoutSlideDirection,
    setLayoutSlideDirection,
    reset,
    modify,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePreferencesStore, import.meta.hot))
}
