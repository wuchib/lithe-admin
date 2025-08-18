import { mergeWith, flatMapDeep, keys, sortBy, isEqual, isPlainObject } from 'lodash-es'

export function mergeWithArrayReplace<T>(target: T, source: any): T {
  return mergeWith({}, target, source, (objValue, srcValue) => {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      return srcValue
    }
  })
}

export function getAllKeys(obj: Record<string, any>, prefix = ''): string[] {
  return flatMapDeep(keys(obj), (key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    return isPlainObject(obj[key])
      ? [fullKey, ...getAllKeys(obj[key] as Record<string, any>, fullKey)]
      : fullKey
  })
}

export function haveSameKeys<T extends object, U extends object>(a: T, b: U): boolean {
  const keysA = sortBy(getAllKeys(a as Record<string, any>))
  const keysB = sortBy(getAllKeys(b as Record<string, any>))
  return isEqual(keysA, keysB)
}
