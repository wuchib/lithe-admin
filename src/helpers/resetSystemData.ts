import { DEFAULT_PREFERENCES_OPTIONS, usePreferencesStore } from '@/stores/preferences'
import { useTabsStore } from '@/stores/tabs'
import { useUserStore } from '@/stores/user'
import { haveSameKeys } from '@/utils/lodash-helpers'

export function resetSystemData() {
  const preferencesStore = usePreferencesStore()
  const tabsStore = useTabsStore()
  const userStore = useUserStore()

  const oldLocalStorage = localStorage.getItem('configure')
  if (oldLocalStorage || haveSameKeys(preferencesStore.preferences, DEFAULT_PREFERENCES_OPTIONS)) {
    tabsStore.clearTabs()
    preferencesStore.reset()
    userStore.cleanup()
    localStorage.clear()
  }
}
