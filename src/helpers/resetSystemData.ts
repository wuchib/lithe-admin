import { DEFAULT_PREFERENCES_OPTIONS, usePreferencesStore } from '@/stores/preferences'
import { useTabsStore } from '@/stores/tabs'
import { useUserStore } from '@/stores/user'
import { haveSameKeys,getAllKeys } from '@/utils/lodash-helpers'

const preferencesStore = usePreferencesStore()
const tabsStore = useTabsStore()
const userStore = useUserStore()

export function resetSystemData() {

  console.log(getAllKeys(preferencesStore.preferences))
  console.log(getAllKeys(DEFAULT_PREFERENCES_OPTIONS))

  const oldLocalStorage = localStorage.getItem('configure')
  if (oldLocalStorage || !haveSameKeys(preferencesStore.preferences, DEFAULT_PREFERENCES_OPTIONS)) {
    tabsStore.clearTabs()
    preferencesStore.reset()
    userStore.cleanup()
    localStorage.clear()
  }
}
