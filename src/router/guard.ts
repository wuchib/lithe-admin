import { createPinia } from 'pinia'

import { useDiscreteApi } from '@/composable/useDiscreteApi'
import { useConfigureStore } from '@/stores/configure'
import { useUserStore } from '@/stores/user'

import type { Router } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

const { loadingBar } = useDiscreteApi()

const configureStore = useConfigureStore(createPinia())

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    configureStore.setNavigating(true)

    if (configureStore.configure.showTopLoadingBar) {
      loadingBar.start()
    }

    const userStore = useUserStore()

    if (to.name === 'signin') {
      if (!userStore.token) {
        next()
      } else {
        next(from.fullPath)
      }
      return false
    }

    if (!userStore.token) {
      if (to.path === '/') {
        userStore.cleanup()
      } else {
        userStore.cleanup(to.fullPath)
      }
      next()
      return false
    }

    if (userStore.token && !router.hasRoute('layout')) {
      await userStore.resolveUserMenu()

      router.addRoute({
        path: '/',
        name: 'layout',
        component: Layout,
        redirect: '/dashboard',
        children: userStore.userRoute,
      })

      next(to.fullPath)

      return false
    }

    next()
  })

  router.beforeResolve((_, __, next) => {
    next()
  })

  router.afterEach(() => {
    configureStore.setNavigating(false)

    if (configureStore.configure.showTopLoadingBar) {
      loadingBar.finish()
    }
  })
}
