import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'

import type { RouteRecordNameGeneric } from 'vue-router'

export interface Tab {
  componentName?: string
  name?: RouteRecordNameGeneric
  icon?: string
  key: string
  label?: string
  locked?: boolean
  pinned?: boolean
}

export const useTabsStore = defineStore('tabsStore', () => {
  const tabs = useStorage<Tab[]>('tabs', [
    {
      componentName: 'Dashboard',
      icon: 'iconify-[mage--dashboard-chart]',
      key: '/dashboard',
      label: '仪表板',
      pinned: true,
    },
  ])

  const tabActiveKey = useStorage<string>('tabActiveKey', '')

  const tabsKeepAlive = useStorage<string[]>('tabsKeepAlive', [])

  const removeTabs = (keys: string[]) => {
    const keysSet = new Set(keys)
    const activeIndex = tabs.value.findIndex((tab) => tab.key === tabActiveKey.value)

    let newActiveKey = ''

    if (keysSet.has(tabActiveKey.value)) {
      for (let i = activeIndex + 1; i < tabs.value.length; i++) {
        if (!keysSet.has(tabs.value[i].key)) {
          newActiveKey = tabs.value[i].key
          break
        }
      }

      if (!newActiveKey) {
        for (let i = activeIndex - 1; i >= 0; i--) {
          if (!keysSet.has(tabs.value[i].key)) {
            newActiveKey = tabs.value[i].key
            break
          }
        }
      }

      if (newActiveKey) {
        setActive(newActiveKey)
      }
    }

    tabs.value = tabs.value.filter((tab) => !keysSet.has(tab.key))
  }

  function findTabIndex(key: string) {
    return tabs.value.findIndex((item) => item.key === key)
  }

  function getUnlockedTabKeysBefore(key: string) {
    const unlockedTabKeys: string[] = []

    for (const tab of tabs.value) {
      if (tab.key === key) break

      if (!tab.locked && !tab.pinned) {
        unlockedTabKeys.push(tab.key)
      }
    }
    return unlockedTabKeys
  }

  function getUnlockedTabKeysAfter(key: string) {
    const unlockedTabKeys: string[] = []

    for (let i = tabs.value.length - 1; i >= 0; i--) {
      if (tabs.value[i].key === key) break

      if (!tabs.value[i].locked && !tabs.value[i].pinned) {
        unlockedTabKeys.push(tabs.value[i].key)
      }
    }

    return unlockedTabKeys
  }

  function getUnlockedTabKeysExcept(key: string) {
    const unlockedTabKeys: string[] = []

    for (const tab of tabs.value) {
      if (tab.key !== key && !tab.locked && !tab.pinned) {
        unlockedTabKeys.push(tab.key)
      }
    }

    return unlockedTabKeys
  }

  function getUnlockedTabKeys() {
    const mutableTabKeys: string[] = []

    for (const tab of tabs.value) {
      if (!tab.locked && !tab.pinned) {
        mutableTabKeys.push(tab.key)
      }
    }

    return mutableTabKeys
  }

  function setTabs(value: Tab[]) {
    tabs.value = value
  }

  function setActive(key: string) {
    tabActiveKey.value = key
  }

  function createTab(tab: Tab) {
    const index = tabs.value.findIndex((item) => item.key === tab.key)

    if (index === -1) {
      tabs.value.push(tab)
    }

    setActive(tab.key)
  }

  const removeTab = (key: string) => {
    removeTabs([key])
  }

  const removeTabsBefore = (key: string) => {
    removeTabs(getUnlockedTabKeysBefore(key))
  }

  const removeTabsAfter = (key: string) => {
    removeTabs(getUnlockedTabKeysAfter(key))
  }

  const removeTabsExcept = (key: string) => {
    removeTabs(getUnlockedTabKeysExcept(key))
  }

  const removeAllTabs = () => {
    removeTabs(getUnlockedTabKeys())
  }

  const hasKeepAlive = (componentName?: string) => {
    const index = tabsKeepAlive.value.findIndex((item) => item === componentName)
    return index !== -1 ? true : false
  }

  const setKeepAlive = (componentName: string) => {
    const index = tabsKeepAlive.value.findIndex((item) => item === componentName)
    if (index !== -1) {
      tabsKeepAlive.value.splice(index, 1)
    } else {
      tabsKeepAlive.value.push(componentName)
    }
  }

  const isPinned = (key: string) => {
    const index = findTabIndex(key)
    return index !== -1 ? tabs.value[index].pinned : void 0
  }

  const isLocked = (key: string) => {
    const index = findTabIndex(key)
    return index !== -1 ? tabs.value[index].locked : void 0
  }

  const setLocked = (key: string) => {
    const index = findTabIndex(key)
    if (index !== -1) {
      tabs.value[index].locked = !tabs.value[index].locked
    }
  }

  return {
    tabs,
    tabActiveKey,
    tabsKeepAlive,
    createTab,
    getUnlockedTabKeys,
    getUnlockedTabKeysBefore,
    getUnlockedTabKeysExcept,
    getUnlockedTabKeysAfter,
    hasKeepAlive,
    isLocked,
    isPinned,
    removeAllTabs,
    removeTabsBefore,
    removeTabsExcept,
    removeTabsAfter,
    removeTab,
    setActive,
    setKeepAlive,
    setLocked,
    setTabs,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTabsStore, import.meta.hot))
}
