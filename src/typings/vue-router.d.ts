import type { RouteParamsGeneric } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    componentName?: string
    pinned?: boolean
    title?: string
    icon?: string
    showTab?: boolean
    enableMultiTab?: boolean
    renderTabTitle?: (params: RouteParamsGeneric) => string
  }
}
