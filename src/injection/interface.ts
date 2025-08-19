import type { ComputedRef, Ref } from 'vue'

export interface MediaQueryInjection {
  sm: ComputedRef<boolean>
  md: ComputedRef<boolean>
  lg: ComputedRef<boolean>
  xl: ComputedRef<boolean>
  xxl: ComputedRef<boolean>
}

export type LayoutSlideDirection = 'left' | 'right' | null

export interface LayoutSlideDirectionInjection {
  direction: Ref<LayoutSlideDirection>
  setDirection: (direction: LayoutSlideDirection) => void
}
