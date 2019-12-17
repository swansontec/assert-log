import { stringify } from './stringify'

/**
 * The error class we use to report differences.
 */
export class AssertionError<T> extends Error {
  actual: T
  expected: T
  name: 'AssertionError'
  showDiff: true

  constructor(opts: { actual: T; expected: T }) {
    const { actual, expected } = opts
    super(`expected ${stringify(expected)} to match ${stringify(actual)}`)
    this.actual = actual
    this.expected = expected
    this.name = 'AssertionError'
    this.showDiff = true
  }
}
