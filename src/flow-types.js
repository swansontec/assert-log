// @flow

interface AssertArray extends Array<string> {
  assert(...expected: string[]): void;
}

interface AssertPromise extends Promise<AssertArray> {
  assert(...expected: string[]): Promise<void>;
}

/**
 * Asserts that a correct sequence of events have occurred.
 * Used for testing callbacks.
 *
 * To log an event, call this function with a string describing the event.
 * Then, to verify that everything is correct, call `read` or `waitFor`
 * to retrieve the entries. These methods return an array or promise
 * with an `assert` method that can be used.
 */
export interface AssertLog {
  (...args: any[]): void;
  assert(...expected: string[]): void;
  read(count?: number): AssertArray;
  waitFor(count: number): AssertPromise;
}

interface AssertLogOptions {
  timeout?: number;
  verbose?: boolean;
}

/**
 * Creates an object that can assert that the correct events have occurred.
 * Used for testing callbacks.
 * @param opts Options include `verbose` and `timeout`.
 */
declare export function makeAssertLog(opts?: AssertLogOptions): AssertLog

/**
 * Pretty-prints arbitrary input data.
 */
declare export function stringify(item: any): string
