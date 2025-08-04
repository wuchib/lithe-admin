import twc from '@/utils/tailwindColor'

import { cbh, cdh, cah, cmh } from './common'

import type { GlobalThemeOverrides } from 'naive-ui'

const light = {
  textColorBase: twc.neutral[800],
  textColor1: twc.neutral[750],
  textColor2: twc.neutral[700],
  textColor3: twc.neutral[500],
  borderColor: twc.neutral[200],
}

const closeIcon = (primaryColor: string) => {
  return {
    closeIconColorSuccess: twc.lime[500],
    closeIconColorInfo: twc.sky[500],
    closeIconColorWarning: twc.amber[500],
    closeIconColorError: twc.red[500],
    closeIconColorLoading: primaryColor,

    closeColorHoverSuccess: cah(twc.lime[400], 0.14),
    closeIconColorHoverSuccess: cdh(twc.lime[500], 0.2),
    closeColorPressedSuccess: cah(twc.lime[400], 0.2),
    closeIconColorPressedSuccess: cdh(twc.lime[500], 0.6),

    closeColorHoverInfo: cah(twc.sky[400], 0.14),
    closeIconColorHoverInfo: cdh(twc.sky[500], 0.2),
    closeColorPressedInfo: cah(twc.sky[400], 0.2),
    closeIconColorPressedInfo: cdh(twc.sky[500], 0.6),

    closeColorHoverWarning: cah(twc.amber[400], 0.14),
    closeIconColorHoverWarning: cdh(twc.amber[500], 0.2),
    closeColorPressedWarning: cah(twc.amber[400], 0.2),
    closeIconColorPressedWarning: cdh(twc.amber[500], 0.6),

    closeColorHoverError: cah(twc.red[400], 0.14),
    closeIconColorHoverError: cdh(twc.red[500], 0.2),
    closeColorPressedError: cah(twc.red[400], 0.2),
    closeIconColorPressedError: cdh(twc.red[500], 0.6),

    closeColorHoverLoading: cah(primaryColor, 0.14),
    closeIconColorHoverLoading: cdh(primaryColor, 0.2),
    closeColorPressedLoading: cah(primaryColor, 0.2),
    closeIconColorPressedLoading: cdh(primaryColor, 0.6),
  } as const
}

export function baseLightThemeOverrides(primaryColor = ''): GlobalThemeOverrides {
  return {
    common: {
      textColorBase: light.textColorBase,

      textColor1: light.textColor1,

      textColor2: light.textColor2,

      textColor3: light.textColor3,

      bodyColor: twc.neutral[25],

      borderColor: light.borderColor,

      cardColor: twc.neutral[25],

      hoverColor: twc.neutral[150],

      modalColor: twc.neutral[100],

      popoverColor: twc.neutral[25],

      scrollbarColor: twc.neutral[200],
      scrollbarColorHover: twc.neutral[250],

      closeIconColor: cbh(twc.neutral[500], 0.2),
      closeColorHover: cah(twc.neutral[500], 0.1),
      closeIconColorPressed: twc.neutral[500],
      closeColorPressed: cah(twc.neutral[500], 0.14),

      infoColor: twc.sky[500],
      infoColorHover: cdh(twc.sky[500], 0.1),
      infoColorPressed: cdh(twc.sky[500], 0.2),
      infoColorSuppl: twc.sky[500],

      successColor: twc.lime[500],
      successColorHover: cdh(twc.lime[500], 0.1),
      successColorPressed: cdh(twc.lime[500], 0.2),
      successColorSuppl: twc.lime[500],

      warningColor: twc.amber[500],
      warningColorHover: cdh(twc.amber[500], 0.1),
      warningColorPressed: cdh(twc.amber[500], 0.2),
      warningColorSuppl: twc.amber[500],

      errorColor: twc.red[500],
      errorColorHover: cdh(twc.red[500], 0.1),
      errorColorPressed: cdh(twc.red[500], 0.2),
      errorColorSuppl: twc.red[500],
    },
    Alert: {
      ...closeIcon(primaryColor),
    },
    Button: {
      textColorSuccess: twc.lime[25],

      textColorInfo: twc.sky[25],

      textColorWarning: twc.amber[25],

      textColorError: twc.red[25],
    },
    Card: {
      borderColor: light.borderColor,
    },
    Checkbox: {
      colorDisabled: twc.neutral[100],
    },
    DataTable: {
      borderColor: light.borderColor,
      tdColor: twc.neutral[25],
      tdColorHover: cdh(twc.neutral[100], 0.06),
      thColor: twc.neutral[100],
    },
    Drawer: {
      footerBorderTop: `1px solid ${light.borderColor}`,
      headerBorderBottom: `1px solid ${light.borderColor}`,
      peers: {
        Scrollbar: {
          color: twc.neutral[300],
          colorHover: twc.neutral[350],
        },
      },
    },
    Divider: {
      color: twc.neutral[150],
    },
    Message: {
      textColorSuccess: twc.lime[500],
      textColorInfo: twc.sky[500],
      textColorWarning: twc.amber[500],
      textColorError: twc.red[500],
      textColorLoading: primaryColor,

      colorSuccess: cbh(twc.lime[25], 0.3),
      colorInfo: cbh(twc.sky[25], 0.3),
      colorWarning: cbh(twc.amber[25], 0.3),
      colorError: cbh(twc.red[25], 0.3),
      colorLoading: cmh(twc.neutral[25], primaryColor, 0.01),

      ...closeIcon(primaryColor),
    },
    Modal: {
      peers: {
        Scrollbar: {
          color: twc.neutral[350],
          colorHover: twc.neutral[300],
        },
      },
    },
    Notification: {
      peers: {
        Scrollbar: {
          color: twc.neutral[350],
          colorHover: twc.neutral[400],
        },
      },
    },
    Popover: {
      color: twc.neutral[25],
      textColor: 'rgb(51, 54, 57)',
    },
    Select: {
      peers: {
        InternalSelectMenu: {
          actionDividerColor: twc.neutral[200],
          peers: {
            Scrollbar: {
              color: twc.neutral[150],
              colorHover: twc.neutral[200],
            },
          },
        },
      },
    },
    Upload: {
      draggerColor: twc.neutral[100],
    },
  }
}
