import { ref } from 'vue'

export type Theme = 'dark' | 'light' | 'system'

interface PersonalizationOptions {
  storageColorKey: string
  defaultColor: string
  defaultTheme: Theme
  storageThemeKey: string
}

let personalizationInstance: ReturnType<typeof setupPersonalization> | null = null

function setupPersonalization(options: PersonalizationOptions) {
  const { storageColorKey, defaultColor, defaultTheme, storageThemeKey } = options

  const rootElement = window.document.documentElement
  const prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const theme = ref<Theme>((localStorage.getItem(storageThemeKey) as Theme) || defaultTheme)
  const color = ref(localStorage.getItem(storageColorKey) || defaultColor)
  const isDark = ref(false)

  function setTheme(value: Theme) {
    theme.value = value

    if (value === 'system') {
      localStorage.removeItem(storageThemeKey)
    } else if (['dark', 'light'].includes(value)) {
      localStorage.setItem(storageThemeKey, theme.value)
    }

    toggleDocumentElementClass()
  }

  function setColor(value: string) {
    color.value = value
    localStorage.setItem(storageColorKey, color.value)
  }

  function toggleDocumentElementClass() {
    const isDarkTheme =
      localStorage.getItem(storageThemeKey) === 'dark' ||
      (!localStorage.getItem(storageThemeKey) && prefersDarkMediaQuery.matches)

    isDark.value = isDarkTheme

    rootElement.classList.toggle('dark', isDarkTheme)
  }

  function updateTheme() {
    const storageTheme = localStorage.getItem(storageThemeKey) as Theme
    if (['dark', 'light'].includes(storageTheme)) {
      setTheme(storageTheme)
    } else {
      setTheme('system')
    }
  }

  function destroy() {
    prefersDarkMediaQuery.removeEventListener('change', toggleDocumentElementClass)
    window.removeEventListener('storage', updateTheme)
  }

  toggleDocumentElementClass()
  prefersDarkMediaQuery.addEventListener('change', toggleDocumentElementClass)
  window.addEventListener('storage', updateTheme)

  return {
    color,
    isDark,
    theme,
    setColor,
    setTheme,
    destroy,
  }
}

export const usePersonalization = () => {
  if (!personalizationInstance) {
    personalizationInstance = setupPersonalization({
      storageColorKey: 'color',
      defaultColor: '#8e51ff',
      defaultTheme: 'system',
      storageThemeKey: 'theme',
    })
  }

  return personalizationInstance
}
