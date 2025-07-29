import type { TabsInjection, MenuInjection } from './interface'
import type { InjectionKey } from 'vue'

export const tabsInjectionKey = Symbol() as InjectionKey<TabsInjection>

export const menuInjectionKey = Symbol() as InjectionKey<MenuInjection>

export * from './interface'
