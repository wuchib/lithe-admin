import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { resetSystemData } from './helpers/resetSystemData'
import router from './router'

async function setupApp() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  resetSystemData()

  await router.isReady()

  if (window.loaderElement) {
    window.loaderElement.remove()
    window.loaderElement = null
  }

  app.mount('#app')
}

setupApp()
