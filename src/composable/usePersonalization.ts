import { ref } from 'vue'

export type Theme = 'dark' | 'light' | 'system'

interface PersonalizationOptions {
  colorKey: string
  defaultColor: string
  defaultTheme: Theme
  storageThemeKey: string
}

let personalizationInstance: ReturnType<typeof createPersonalization> | null = null

function createPersonalization(options: PersonalizationOptions) {
  const { colorKey, defaultColor, defaultTheme, storageThemeKey } = options

  const rootElement = window.document.documentElement
  const prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const theme = ref<Theme>((localStorage.getItem(storageThemeKey) as Theme) || defaultTheme)
  const color = ref(localStorage.getItem(colorKey) || defaultColor)
  const isDark = ref(false)

  function setTheme(value: Theme) {
    theme.value = value

    if (value === 'system') {
      localStorage.removeItem(storageThemeKey)
    } else if (['dark', 'light'].includes(value)) {
      localStorage.setItem(storageThemeKey, theme.value)
    }

    updateThemeClass()
  }

  function setColor(value: string) {
    color.value = value
    localStorage.setItem(colorKey, color.value)
  }

  function updateThemeClass() {
    const isDarkTheme =
      localStorage.getItem(storageThemeKey) === 'dark' ||
      (!localStorage.getItem(storageThemeKey) && prefersDarkMediaQuery.matches)

    isDark.value = isDarkTheme

    rootElement.classList.toggle('dark', isDarkTheme)
  }

  function applyThemeFromStorage() {
    const storageTheme = localStorage.getItem(storageThemeKey) as Theme
    if (['dark', 'light'].includes(storageTheme)) {
      setTheme(storageTheme)
    } else {
      setTheme('system')
    }
  }

  function destroy() {
    prefersDarkMediaQuery.removeEventListener('change', updateThemeClass)
    window.removeEventListener('storage', applyThemeFromStorage)
  }

  updateThemeClass()
  prefersDarkMediaQuery.addEventListener('change', updateThemeClass)
  window.addEventListener('storage', applyThemeFromStorage)

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
    personalizationInstance = createPersonalization({
      colorKey: 'color',
      defaultColor: '#8e51ff',
      defaultTheme: 'system',
      storageThemeKey: 'theme',
    })
  }

  return personalizationInstance
}
