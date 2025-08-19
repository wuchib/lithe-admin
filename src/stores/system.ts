import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import packageJson from '@/../package.json'
import { usePreferencesStore } from '@/stores/preferences'
import { useTabsStore } from '@/stores/tabs'
import { useUserStore } from '@/stores/user'

export const useSystemStore = defineStore('systemStore', () => {
  const version = useStorage('version', '')

  const oldLocalStorage = localStorage.getItem('configure')
  if (oldLocalStorage || version.value !== packageJson.version) {
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
