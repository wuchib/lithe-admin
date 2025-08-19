import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'

import packageJson from '@/../package.json'
import { usePreferencesStore } from '@/stores'
import { useTabsStore } from '@/stores'
import { useUserStore } from '@/stores'

export const useSystemStore = defineStore('systemStore', () => {
  const version = useStorage('version', '')

  const legacyConfig = localStorage.getItem('configure')

  if (legacyConfig || version.value !== packageJson.version) {
    useTabsStore().clearTabs()
    usePreferencesStore().reset()
    useUserStore().cleanup()
    localStorage.clear()
    version.value = packageJson.version
  }

  return {
    version,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSystemStore, import.meta.hot))
}
