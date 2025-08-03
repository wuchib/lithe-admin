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
      name: 'dashboard',
      label: '仪表板',
      pinned: true,
    },
  ])

  const tabActiveKey = useStorage<string>('tabActiveKey', '')

  const keepAliveTabs = useStorage<string[]>('keepAliveTabs', [])

  function removeTabs(keys: string[]) {
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

  function getUnlockedKeysBefore(key: string) {
    const unlockedKeys: string[] = []

    for (const tab of tabs.value) {
      if (tab.key === key) break

      if (!tab.locked && !tab.pinned) {
        unlockedKeys.push(tab.key)
      }
    }
    return unlockedKeys
  }

  function getUnlockedKeysAfter(key: string) {
    const unlockedKeys: string[] = []

    for (let i = tabs.value.length - 1; i >= 0; i--) {
      if (tabs.value[i].key === key) break

      if (!tabs.value[i].locked && !tabs.value[i].pinned) {
        unlockedKeys.push(tabs.value[i].key)
      }
    }

    return unlockedKeys
  }

  function getUnlockedKeysExcept(key: string) {
    const unlockedKeys: string[] = []

    for (const tab of tabs.value) {
      if (tab.key !== key && !tab.locked && !tab.pinned) {
        unlockedKeys.push(tab.key)
      }
    }

    return unlockedKeys
  }

  function getUnlockedKeys() {
    const unlockedKeys: string[] = []

    for (const tab of tabs.value) {
      if (!tab.locked && !tab.pinned) {
        unlockedKeys.push(tab.key)
      }
    }

    return unlockedKeys
  }

  function update(value: Tab[]) {
    tabs.value = value
  }

  function setActive(key: string) {
    tabActiveKey.value = key
  }

  function create(tab: Tab) {
    const index = tabs.value.findIndex((item) => item.key === tab.key)

    if (index === -1) {
      tabs.value.push(tab)
    }

    setActive(tab.key)
  }

  const remove = (key: string) => {
    removeTabs([key])
  }

  const removeBefore = (key: string) => {
    removeTabs(getUnlockedKeysBefore(key))
  }

  const removeAfter = (key: string) => {
    removeTabs(getUnlockedKeysAfter(key))
  }

  const removeExcept = (key: string) => {
    removeTabs(getUnlockedKeysExcept(key))
  }

  const removeAll = () => {
    removeTabs(getUnlockedKeys())
  }

  const hasKeepAliveTab = (componentName?: string) => {
    const index = keepAliveTabs.value.findIndex((item) => item === componentName)
    return index !== -1 ? true : false
  }

  const setKeepAliveTab = (componentName: string) => {
    const index = keepAliveTabs.value.findIndex((item) => item === componentName)
    if (index !== -1) {
      keepAliveTabs.value.splice(index, 1)
    } else {
      keepAliveTabs.value.push(componentName)
    }
  }

  const isPinned = (key: string) => {
    const index = findTabIndex(key)
    return index !== -1 ? tabs.value[index].pinned : undefined
  }

  const isLocked = (key: string) => {
    const index = findTabIndex(key)
    return index !== -1 ? tabs.value[index].locked : undefined
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
    keepAliveTabs,
    getUnlockedKeysBefore,
    getUnlockedKeysAfter,
    getUnlockedKeys,
    getUnlockedKeysExcept,
    create,
    remove,
    update,
    removeBefore,
    removeAfter,
    removeExcept,
    removeAll,
    isLocked,
    isPinned,
    setActive,
    setKeepAliveTab,
    setLocked,
    hasKeepAliveTab,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTabsStore, import.meta.hot))
}
