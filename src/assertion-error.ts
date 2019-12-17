/**
 * The error class we use to report differences.
 */
export class AssertionError extends Error {
  actual: string[]
  expected: string[]
  name: 'AssertionError'
  showDiff: true

  constructor(opts: { actual: string[]; expected: string[] }) {
    const { actual, expected } = opts
    super(
      `expected ${JSON.stringify(expected)} to match ${JSON.stringify(actual)}`
    )
    this.actual = actual
    this.expected = expected
    this.name = 'AssertionError'
    this.showDiff = true
  }
}
