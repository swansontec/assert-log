import { AssertionError } from './assertion-error'
import { addHiddenProperties, compareArrays } from './utils'

interface AssertArray extends Array<string> {
  assert(...expected: string[]): void
}

interface AssertPromise extends Promise<AssertArray> {
  assert(...expected: string[]): Promise<void>
}

/**
 * Asserts that a correct sequence of events have occurred.
 * Used for testing callbacks.
 *
 * To log an event, call this function with a string describing the event.
 * Then, to verify that everything is correct, call `read` or `waitFor`
 * to retrieve the entries. These methods return an array or promise
 * with an `assert` method that can be used to check the entries.
 */
export interface AssertLog {
  (...args: unknown[]): void
  assert(...expected: string[]): void
  read(count?: number): AssertArray
  waitFor(count: number): AssertPromise
}

interface AssertLogOptions {
  timeout?: number
  verbose?: boolean
}

/**
 * Creates an object that can assert that the correct events have occurred.
 * Used for testing callbacks.
 * @param opts Options include `verbose` and `timeout`.
 */
export function makeAssertLog(opts: AssertLogOptions = {}): AssertLog {
  const { timeout = 1000, verbose = false } = opts
  const events: string[] = []

  // Pending `waitFor` calls:
  type Listener = (event: string) => void
  const listeners: Listener[] = []

  function read(count = events.length): AssertArray {
    const array = events.splice(0, count)
    return addHiddenProperties(array, { assert: arrayAssert })
  }

  function waitFor(count: number): AssertPromise {
    if (events.length >= count) {
      const promise = Promise.resolve(read(count))
      return addHiddenProperties(promise, { assert: promiseAssert })
    }

    const promise: Promise<AssertArray> = new Promise(resolve => {
      // Start our own private event log:
      const events = read(count)

      // Resolves the promise and removes the listener from the list:
      function finish(): void {
        resolve(events)
        const index = listeners.indexOf(listener)
        if (index >= 0) listeners.splice(index, 1)
      }
      const timeoutId = setTimeout(finish, timeout)

      // Record an event in our own private log:
      function listener(event: string): void {
        events.push(event)
        if (events.length >= count) {
          clearTimeout(timeoutId)
          finish()
        }
      }
      listeners.push(listener)
    })
    return addHiddenProperties(promise, { assert: promiseAssert })
  }

  function log(): void {
    // Combine the arguments:
    let event = ''
    for (let i = 0; i < arguments.length; ++i) {
      const arg = arguments[i]
      if (i > 0) event += ' '
      event += typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    }

    // Handle the event:
    if (verbose) console.log(event)
    if (listeners.length > 0) listeners[0](event)
    else events.push(event)
  }

  return addHiddenProperties(log, { assert: logAssert, waitFor, read })
}

/**
 * The assert method to be placed on an array.
 */
function arrayAssert(this: string[], ...expected: string[]): void {
  const actual = this.slice().sort()
  if (!compareArrays(actual, expected.sort())) {
    throw new AssertionError({ actual, expected })
  }
}

/**
 * The assert method to be placed on a promise.
 */
function promiseAssert(
  this: Promise<string[]>,
  ...expected: string[]
): Promise<void> {
  return this.then(array => {
    const actual = array.slice().sort()
    if (!compareArrays(actual, expected.sort())) {
      throw new AssertionError({ actual, expected })
    }
  })
}

/**
 * The assert method to placed on a log.
 */
function logAssert(this: AssertLog, ...expected: string[]): void {
  const actual = this.read().sort()
  if (!compareArrays(actual, expected.sort())) {
    throw new AssertionError({ actual, expected })
  }
}
