import type { MediaQueryProvider, LayoutProvider, HeaderLayoutProvider } from './interface'
import type { InjectionKey } from 'vue'

export const mediaQueryInjectionKey: InjectionKey<MediaQueryProvider> =
  Symbol('mediaQueryInjectionKey')

export const layoutInjectionKey: InjectionKey<LayoutProvider> = Symbol('layoutInjectionKey')

export const headerLayoutInjectionKey: InjectionKey<HeaderLayoutProvider> = Symbol(
  'headerLayoutInjectionKey',
)

export * from './interface'
