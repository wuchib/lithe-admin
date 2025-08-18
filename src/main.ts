import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { DEFAULT_PREFERENCES_OPTIONS, usePreferencesStore } from './stores/preferences'
import { useTabsStore } from './stores/tabs'
import { useUserStore } from './stores/user'
import { haveSameKeys } from './utils/lodash-helpers'

function clearSystemData() {
  const preferencesStore = usePreferencesStore()
  const tabsStore = useTabsStore()
  const userStore = useUserStore()

  const oldLocalStorage = localStorage.getItem('configure')
  if (oldLocalStorage && haveSameKeys(preferencesStore.preferences, DEFAULT_PREFERENCES_OPTIONS)) {
    tabsStore.clearTabs()
    preferencesStore.reset()
    userStore.cleanup()
    localStorage.clear()
  }
}

async function setupApp() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  clearSystemData()

  await router.isReady()

  if (window.loaderElement) {
    window.loaderElement.remove()
    window.loaderElement = null
  }

  app.mount('#app')
}

setupApp()
