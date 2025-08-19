import type { LayoutSlideDirectionInjection, MediaQueryInjection } from './interface'
import type { InjectionKey } from 'vue'

export const mediaQueryInjectionKey: InjectionKey<MediaQueryInjection> =
  Symbol('mediaQueryInjectionKey')
export const layoutSlideDirectionInjectionKey: InjectionKey<LayoutSlideDirectionInjection> = Symbol(
  'layoutSlideDirectionInjectionKey',
)

export * from './interface'
