/**
 * Pretty-prints arbitrary input data.
 */
export function stringify(item: any): string {
  return stringifyInner(item, [])
}

function stringifyInner(item: any, parents: any[]): string {
  // Check for loops:
  const index = parents.indexOf(item)
  if (index >= 0) return `parent${parents.length - index}`

  // Primitives & special objects:
  if (typeof item === 'string') return JSON.stringify(item)
  if (typeof item === 'function') return 'function'
  if (typeof item !== 'object' || item == null) return String(item)
  if (typeof item.toJSON === 'function') return item.toJSON()
  if (item instanceof Error) return String(item)

  // We are going to recurse, so get the stack ready:
  parents = parents.slice()
  parents.push(item)

  // If all the keys are integers, use the array syntax:
  if (isArrayLike(item)) {
    let out = '['
    for (let i = 0; i < item.length; ++i) {
      if (i !== 0) out += ', '
      out += stringifyInner(item[i], parents)
    }
    return out + ']'
  }

  // Otherwise, use object syntax:
  let out = '{ '
  let count = 0
  for (const key in item) {
    if (!Object.prototype.hasOwnProperty.call(item, key)) continue
    if (count !== 0) out += ', '
    out += key + ': ' + stringifyInner(item[key], parents)
    ++count
  }
  return count === 0 ? '{}' : out + ' }'
}

/**
 * Returns true if an item looks like an array.
 * It must have an integer length property, and its enumerable own keys
 * must be the set of whole numbers less than its length.
 *
 * Built-in `Array` objects can fail this test if they have gaps
 * or extra properties.
 */
function isArrayLike(item: any): item is ArrayLike<unknown> {
  const { length } = item
  if (typeof length !== 'number') return false

  // Each of our keys must be a plain integer less than the length:
  let count = 0
  for (const key in item) {
    if (!Object.prototype.hasOwnProperty.call(item, key)) continue
    if (!/^[1-9][0-9]*$|^0$/.test(key) || Number(key) >= length) return false
    ++count
  }

  // A difference here means we have a gap:
  return count === length
}
