import type { ComputedRef, Ref } from 'vue'

export interface MediaQueryProvider {
  sm: ComputedRef<boolean>
  md: ComputedRef<boolean>
  lg: ComputedRef<boolean>
  xl: ComputedRef<boolean>
  xxl: ComputedRef<boolean>
}

export type LayoutSlideDirection = 'left' | 'right' | null

export interface LayoutProvider {
  shouldRefreshRoute: Ref<boolean>
  layoutSlideDirection: Ref<LayoutSlideDirection>
  setLayoutSlideDirection: (direction: LayoutSlideDirection) => void
}
