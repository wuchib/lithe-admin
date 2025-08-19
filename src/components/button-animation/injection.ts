import type { ButtonAnimationProps } from './interface'
import type { InjectionKey } from 'vue'

export const buttonAnimationInjectionKey = Symbol() as InjectionKey<Partial<ButtonAnimationProps>>
