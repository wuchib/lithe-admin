import type { RouteParamsGeneric } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    componentName?: string
    pinned?: boolean
    label?: string
    icon?: string
    showTab?: boolean
    enableMultiTab?: boolean
    renderTabLabel?: (params: RouteParamsGeneric) => string
  }
}
