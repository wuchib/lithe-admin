import { createRouter, createWebHistory } from 'vue-router'

import { setupRouterGuard } from './guard'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/sign-in', name: 'signin', component: () => import('@/views/sign-in/index.vue') },
  {
    name: 'errorPage',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error-page/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  strict: true,
})

setupRouterGuard(router)

export default router
