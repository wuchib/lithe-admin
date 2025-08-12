import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import packageJson from '@/../package.json'

import { usePreferencesStore } from './preferences'
import { useTabsStore } from './tabs'
import { useUserStore } from './user'

type SystemInfoOptions = {
  version: string
}

const DEFAULT_SYSTEM_INFO_OPTIONS: SystemInfoOptions = {
  version: packageJson.version,
}

export const useSystemStore = defineStore('systemStore', () => {
  const rawSystemStore = localStorage.getItem('systemInfo')

  const systemInfo = useStorage<SystemInfoOptions>('systemInfo', DEFAULT_SYSTEM_INFO_OPTIONS)

  const oldLocalStorage = localStorage.getItem('configure')
  const storedVersion = rawSystemStore ? JSON.parse(rawSystemStore).version : null
  const currentVersion = packageJson.version

  if (oldLocalStorage || storedVersion) {
    const shouldClear = !storedVersion || storedVersion !== currentVersion
    if (shouldClear) {
      useTabsStore().clearTabs()
      usePreferencesStore().reset()
      useUserStore().cleanup()
      localStorage.clear()
    }

    systemInfo.value = { version: packageJson.version }
  }

  return {
    systemInfo,
  }
})
