import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    compName?: string
    pinned?: boolean
    label?: string
    icon?: string
    showTab?: boolean
    multiTab?: boolean
  }
}
