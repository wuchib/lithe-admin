import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    componentName?: string
    pinned?: boolean
    label?: string
    icon?: string
    showTab?: boolean
    enableMultiTab?: boolean
  }
}
