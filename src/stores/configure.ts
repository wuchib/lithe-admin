import { useStorage } from '@vueuse/core'
import { mergeWith } from 'lodash-es'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, watch } from 'vue'

import type { WatermarkProps } from 'naive-ui'

export interface ConfigureOptions {
  menuCollapsed: boolean
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

const DEFAULT_CONFIGURE_OPTIONS: ConfigureOptions = {
  menuCollapsed: false,
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

export const useConfigureStore = defineStore('configureStore', () => {
  const configure = useStorage<ConfigureOptions>('configure', DEFAULT_CONFIGURE_OPTIONS)

  const modify = (options: Partial<ConfigureOptions>) => {
    configure.value = mergeWith({}, configure.value, options, (objValue, srcValue) => {
      if (Array.isArray(objValue) && Array.isArray(srcValue)) {
        return srcValue
      }
    })

    return null
  }

  const reset = () => {
    configure.value = structuredClone(DEFAULT_CONFIGURE_OPTIONS)
  }

  watch(
    () => configure.value.enableTextSelect,
    (newValue) => {
      document.documentElement.style.userSelect = newValue ? 'auto' : 'none'
    },
    {
      immediate: true,
    },
  )

  return {
    configure,
    reset,
    modify,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfigureStore, import.meta.hot))
}
