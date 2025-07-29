import { createRouter, createWebHistory } from 'vue-router'

import { setupRouterGuard } from './guard'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/sign-in', name: 'signin', component: () => import('@/views/sign-in/index.vue') },
  {
    name: 'notfound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/not-found/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  strict: true,
})

setupRouterGuard(router)

export default router
