import type { MediaQueryInjection } from './interface'
import type { InjectionKey } from 'vue'

export const mediaQueryInjectionKey = Symbol() as InjectionKey<MediaQueryInjection>

export * from './interface'
