import type { Reactive, Ref } from 'vue'

export interface TabsInjection {
  doRefresh: (value: boolean) => void
  shouldRefresh: Ref<boolean>
}

export interface MenuInjection {
  collapse: Reactive<{
    width: number
    maxWidth: number
  }>
}
