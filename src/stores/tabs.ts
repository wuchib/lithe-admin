import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'

export interface Tab {
  compName?: string
  name?: string
  icon?: string
  key: string
  label?: string
  locked?: boolean
  pinned?: boolean
}

export const useTabsStore = defineStore('tabsStore', () => {
  const tabs = useStorage<Tab[]>('tabs', [
    {
      compName: 'Dashboard',
      icon: 'iconify-[mage--dashboard-chart]',
      key: '/dashboard',
      label: '仪表板',
      pinned: true,
    },
  ])

  const tabActiveKey = useStorage<string>('tabActiveKey', '')

  const tabsKeepAlive = useStorage<string[]>('tabsKeepAlive', [])

  const removeTabs = (keys: string[]) => {
    const activeTabKeyIndex = tabs.value.findIndex((item) => item.key === tabActiveKey.value)

    if (keys.includes(tabActiveKey.value)) {
      let newActiveKey = ''

      for (let i = activeTabKeyIndex + 1; i < tabs.value.length; i++) {
        if (!keys.includes(tabs.value[i].key)) {
          newActiveKey = tabs.value[i].key
          break
        }
      }

      if (!newActiveKey) {
        for (let i = activeTabKeyIndex - 1; i >= 0; i--) {
          if (!keys.includes(tabs.value[i].key)) {
            newActiveKey = tabs.value[i].key
            break
          }
        }
      }

      setActive(newActiveKey)
    }

    tabs.value = tabs.value.filter((item) => !keys.includes(item.key))
  }

  function findTabIndex(key: string) {
    return tabs.value.findIndex((item) => item.key === key)
  }

  function getLefts(key: string) {
    const mutableTabKeys: string[] = []

    for (let i = 0; i < tabs.value.length; i++) {
      if (tabs.value[i].key === key) break

      if (!tabs.value[i].locked && !tabs.value[i].pinned) {
        mutableTabKeys.push(tabs.value[i].key)
      }
    }

    return mutableTabKeys
  }

  function getRights(key: string) {
    const mutableTabKeys: string[] = []

    for (let i = tabs.value.length - 1; i >= 0; i--) {
      if (tabs.value[i].key === key) break

      if (!tabs.value[i].locked && !tabs.value[i].pinned) {
        mutableTabKeys.push(tabs.value[i].key)
      }
    }

    return mutableTabKeys
  }

  function getOthers(key: string) {
    const mutableTabKeys: string[] = []

    for (let i = 0; i < tabs.value.length; i++) {
      if (tabs.value[i].key !== key) {
        if (!tabs.value[i].locked && !tabs.value[i].pinned) {
          mutableTabKeys.push(tabs.value[i].key)
        }
      }
    }

    return mutableTabKeys
  }

  function getAlls() {
    const mutableTabKeys: string[] = []

    for (let i = 0; i < tabs.value.length; i++) {
      if (!tabs.value[i].locked && !tabs.value[i].pinned) {
        mutableTabKeys.push(tabs.value[i].key)
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

  const removeLefts = (key: string) => {
    removeTabs(getLefts(key))
  }

  const removeRights = (key: string) => {
    removeTabs(getRights(key))
  }

  const removeOthers = (key: string) => {
    removeTabs(getOthers(key))
  }

  const removeAlls = () => {
    removeTabs(getAlls())
  }

  const hasKeepAlive = (compName?: string) => {
    const index = tabsKeepAlive.value.findIndex((item) => item === compName)
    return index !== -1 ? true : false
  }

  const addKeepAlive = (compName: string) => {
    const index = tabsKeepAlive.value.findIndex((item) => item === compName)
    if (index !== -1) {
      tabsKeepAlive.value.splice(index, 1)
    } else {
      tabsKeepAlive.value.push(compName)
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
    create,
    getAlls,
    getLefts,
    getOthers,
    getRights,
    hasKeepAlive,
    isLocked,
    isPinned,
    removeAlls,
    removeLefts,
    removeOthers,
    removeRights,
    remove,
    setActive,
    addKeepAlive,
    setLocked,
    setTabs,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTabsStore, import.meta.hot))
}
