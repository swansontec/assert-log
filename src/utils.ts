/**
 * Like `Object.assign`, but makes the properties non-enumerable.
 */
export function addHiddenProperties<O, P>(object: O, properties: P): O & P {
  for (const name in properties) {
    Object.defineProperty(object, name, {
      writable: true,
      configurable: true,
      value: properties[name]
    })
  }
  return object as O & P
}

/**
 * Returns true if two lists of strings match.
 */
export function compareArrays<T>(actual: T[], expected: T[]): boolean {
  actual.sort()
  expected.sort()
  if (actual.length !== expected.length) return false
  for (let i = 0; i < expected.length; ++i) {
    if (actual[i] !== expected[i]) return false
  }
  return true
}
