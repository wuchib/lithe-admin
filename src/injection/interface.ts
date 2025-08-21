import type { ComputedRef, Ref } from 'vue'

export interface MediaQueryProvider {
  isSmallScreen: ComputedRef<boolean>
  isMediumScreen: ComputedRef<boolean>
  isLargeScreen: ComputedRef<boolean>
  isExtraLargeScreen: ComputedRef<boolean>
  isExtraExtraLargeScreen: ComputedRef<boolean>
}

export type LayoutSlideDirection = 'left' | 'right' | null

export interface LayoutProvider {
  shouldRefreshRoute: Ref<boolean>
  layoutSlideDirection: Ref<LayoutSlideDirection>
  setLayoutSlideDirection: (direction: LayoutSlideDirection) => void
}
