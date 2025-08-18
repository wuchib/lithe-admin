import { describe, expect, it } from 'vitest'

import { getAllKeys, haveSameKeys, mergeWithArrayReplace } from './lodash-helpers'

describe('lodash-helpers', () => {
  it('should be mergeWithArrayReplace', () => {

    const obj1 = {
      a: 1,
      b: 2,
      c: 3,
      d: {
        e: 4,
        f: 5,
      },
      g: [1, 2]
    }

    const obj2 = {
      a: 1,
      b: 2,
      c: 3,
      d: {
        f: 5,
        z: 10,
      },
      g: [3, 2, 1],
    }

    const result = mergeWithArrayReplace(obj1, obj2)

    expect(result).toEqual({
      a: 1,
      b: 2,
      c: 3,
      d: {
        e: 4,
        f: 5,
        z: 10,
      },
      g: [3, 2, 1],
    })
  })

  it('should be getAllKeys', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    }

    const result = getAllKeys(obj)

    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should be haveSameKeys', () => {
    const obj1 = {
      a: 1,
      b: 2,
      c: 3,
      d: {
        e: 4,
        f: 5,
      },
    }

    const obj2 = {
      a: 11,
      b: 22,
      c: 32,
      d: {
        e: 4,
        f: 5,
      },
    }

    const result = haveSameKeys(obj1, obj2)

    expect(result).toBe(true)
  })
})
