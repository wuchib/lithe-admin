import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

async function setupApp() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  await router.isReady()

  if (window.eltLoader) {
    window.eltLoader.remove()
    window.eltLoader = null
  }

  app.mount('#app')
}

setupApp()
