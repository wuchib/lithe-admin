declare global {
  interface Window {
    navigation: {
      canGoBack: boolean
      canGoForward: boolean
    }
    eltLoader?: HTMLElement | null
  }
}

export {}
