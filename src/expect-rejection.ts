import { AssertionError } from './assertion-error'

/**
 * Verifies that a promise rejects with a particular error.
 */
export function expectRejection(
  promise: Promise<unknown>,
  expected?: string | RegExp
): Promise<void> {
  return promise.then(
    ok => {
      throw new Error('Expecting this promise to reject')
    },
    error => {
      const actual = String(error)
      if (typeof expected === 'string') {
        if (actual !== expected) {
          throw new AssertionError({ actual, expected })
        }
      } else if (expected instanceof RegExp) {
        if (!expected.test(actual)) {
          throw new AssertionError({ actual, expected: String(expected) })
        }
      }
    }
  )
}
