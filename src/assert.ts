import { AssertLog } from './index'

/**
 * The error class we use to report log differences.
 */
class AssertionError extends Error {
  actual: string[]
  expected: string[]
  name: 'AssertionError'
  showDiff: true

  constructor(actual: string[], expected: string[]) {
    super(
      `expected log to contain ${JSON.stringify(
        expected
      )}, but got ${JSON.stringify(actual)}`
    )
    this.actual = actual
    this.expected = expected
    this.name = 'AssertionError'
    this.showDiff = true
  }
}

/**
 * Returns true if two lists of strings match.
 */
function compare(actual: string[], expected: string[]): boolean {
  actual.sort()
  expected.sort()
  if (actual.length !== expected.length) return false
  for (let i = 0; i < expected.length; ++i) {
    if (actual[i] !== expected[i]) return false
  }
  return true
}

/**
 * The assert method to be placed on an array.
 */
export function arrayAssert(this: string[], ...expected: string[]): void {
  const actual = this.slice().sort()
  if (!compare(actual, expected.sort())) {
    throw new AssertionError(actual, expected)
  }
}

/**
 * The assert method to be placed on a promise.
 */
export function promiseAssert(
  this: Promise<string[]>,
  ...expected: string[]
): Promise<void> {
  return this.then(array => {
    const actual = array.slice().sort()
    if (!compare(actual, expected.sort())) {
      throw new AssertionError(actual, expected)
    }
  })
}

/**
 * The assert method to placed on a log.
 */
export function logAssert(this: AssertLog, ...expected: string[]): void {
  const actual = this.read().sort()
  if (!compare(actual, expected.sort())) {
    throw new AssertionError(actual, expected)
  }
}
