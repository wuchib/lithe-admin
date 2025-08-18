import type { Ref } from 'vue'

export interface MediaQueryInjection {
  sm: Ref<boolean>
  md: Ref<boolean>
  lg: Ref<boolean>
  xl: Ref<boolean>
  '2xl': Ref<boolean>
}
