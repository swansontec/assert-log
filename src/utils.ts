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
