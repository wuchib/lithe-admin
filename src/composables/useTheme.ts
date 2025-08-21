import { merge } from 'lodash-es'
import { darkTheme, lightTheme } from 'naive-ui'
import { computed } from 'vue'

import { commonThemeOverrides } from '@/theme/common'
import { baseDarkThemeOverrides } from '@/theme/dark'
import { baseLightThemeOverrides } from '@/theme/light'

import { usePersonalization } from './usePersonalization'

export function useTheme() {
  const { color, isDark } = usePersonalization()

  const getLightThemeOverrides = (primaryColor = color.value) => {
    return merge(commonThemeOverrides(primaryColor), baseLightThemeOverrides(primaryColor))
  }

  const getDarkThemeOverrides = (primaryColor = color.value) => {
    return merge(commonThemeOverrides(primaryColor), baseDarkThemeOverrides(primaryColor))
  }

  const themeOverrides = computed(() => {
    return isDark.value ? getDarkThemeOverrides(color.value) : getLightThemeOverrides(color.value)
  })

  const theme = computed(() => {
    return isDark.value ? darkTheme : lightTheme
  })

  return {
    color,
    isDark,
    theme,
    themeOverrides,
    getLightThemeOverrides,
    getDarkThemeOverrides,
  }
}
