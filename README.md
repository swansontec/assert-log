# assert-log

> Any easy way to unit-test callbacks

If you need to unit-test some code that calls callbacks, you could use a mocking library like [sinon.js](https://sinonjs.org/), but there is a simpler technique. Just write your own callbacks, but have them send their output to a log. When the test is over, verify that the log matches your expectation. For example, suppose you want to unit-test this thing:

```typescript
class ExampleCounter {
  on(event, callback) { /* ... */ }
  increment() { /* ... */ }
  decrement() { /* ... */ }
}
```

Here is what the test might look like:

```typescript
import makeAssertLog from 'assert-log'

const log = makeAssertLog()

// Set up the callbacks:
const counter = new ExampleCounter()
counter.on('count', count => log('count is', count))
counter.on('error', error => log(error))

// Generate some events:
counter.increment()
log.assert('count is 1')

counter.decrement()
log.assert('count is 0')

counter.decrement()
log.assert('Error: Count cannot be negative')
```

The `log` function records a log entry. It accepts multiple arguments, which it concatenates together to make a single string.

The `assert` method verifies that that log contains the given strings in any order, and then clears the log.

If you need more control than `assert` provides, the log also has a `read` method. This method removes log entries and returns them. It accepts the maximum number of entries to return, but this is optional. It returns an array of strings. The returned array also has an `assert` method for convenience:

```typescript
// Read and check the first entry:
log.read(1).assert('got 1')

// Read the remaining entries:
const entries = log.read()

// Use a separate assertion library to do fancy tests:
expect(entries[0]).to.not.match(/Error/)
```

The log also has `waitFor` method, which is like an asynchronous version of `read`. It waits for the requested number of entries to arrive, and then returns them in a promise. The returned promise also has an `assert` method for convenience:

```typescript
setTimeout(() => log('timeout 1'), 10)
setTimeout(() => log('timeout 2'), 15)
await log.waitFor(2).assert('timeout 1', 'timeout 2')
```

The `waitFor` method will stop waiting after 1 second and just return whatever is available. If you want to tweak this timeout, just pass a `timeout` option to `makeAssertLog` (in milliseconds):

```typescript
const log = makeAssertLog({ timeout: 100 })
```

The `makeAssertLog` function also takes a `verbose` boolean option, which copies the log entries to `console.log`. This can be helpful while debugging, but isn't something you would normally leave turned on:

```typescript
const log = makeAssertLog({ verbose: true })
```
