import chroma from 'chroma-js'

import { usePersonalization } from '@/composables'
import twc from '@/utils/tailwindColor'

import type { GlobalThemeOverrides } from 'naive-ui'

const { isDark } = usePersonalization()

export function ccAPCA(
  backgroundColor: string,
  color1: string = '#ffffff',
  color2: string = '#000000',
  bodyColor?: string,
): string {
  bodyColor = isDark.value ? twc.neutral[950] : twc.neutral[25]

  const cBackgroundColor = chroma(backgroundColor)
  const cBodyColor = chroma(bodyColor)

  const actualDisplayColor = chroma.mix(
    cBackgroundColor.alpha(1),
    cBodyColor,
    1 - cBackgroundColor.alpha(),
    'rgb',
  )

  const contrastWithLight = Math.abs(chroma.contrastAPCA(color1, actualDisplayColor))
  const contrastWithDark = Math.abs(chroma.contrastAPCA(color2, actualDisplayColor))

  return contrastWithLight > contrastWithDark ? color1 : color2
}

export function cah(color: string, value: number) {
  return chroma(color).alpha(value).hex()
}

export function cbh(color: string, value: number) {
  return chroma(color).brighten(value).hex()
}

export function cdh(color: string, value: number) {
  return chroma(color).darken(value).hex()
}

export function cmh(color1: string, color2: string, ratio: number) {
  return chroma.mix(color1, color2, ratio).hex()
}

export function commonThemeOverrides(primaryColor = ''): GlobalThemeOverrides {
  return {
    common: {
      actionColor: '',

      borderRadius: '4px',

      primaryColor,
      primaryColorHover: cdh(primaryColor, 0.1),
      primaryColorPressed: cdh(primaryColor, 0.2),
      primaryColorSuppl: primaryColor,

      scrollbarBorderRadius: '0',
    },
    Button: {
      textColorPrimary: ccAPCA(primaryColor, twc.neutral[150], twc.neutral[950]),
      textColorHoverPrimary: cdh(ccAPCA(primaryColor, twc.neutral[150], twc.neutral[950]), 0.1),
      textColorPressedPrimary: cdh(ccAPCA(primaryColor, twc.neutral[150], twc.neutral[950]), 0.2),
      textColorSupplPrimary: ccAPCA(primaryColor, twc.neutral[150], twc.neutral[950]),
      textColorFocusPrimary: ccAPCA(primaryColor, twc.neutral[150], twc.neutral[950]),
    },
    Checkbox: {
      checkMarkColor: ccAPCA(primaryColor, twc.neutral[150], twc.neutral[800]),
    },
    Dialog: {
      iconSize: '24px',
      iconMargin: '0 8px 0 0',
    },
    Drawer: {
      borderRadius: 0,
    },
    Message: {
      iconMargin: '0 6px 0 0',
      padding: '10px 18px',
    },

    Popconfirm: {
      iconSize: '20px',
    },
    Scrollbar: {
      railInsetHorizontalBottom: 'auto 0px 0px 0px',
      railInsetVerticalRight: '0px 0px 0px auto',
    },
  }
}
