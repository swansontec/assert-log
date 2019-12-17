import { expect } from 'chai'
import { describe, it } from 'mocha'

import { makeAssertLog } from '../src/index'

describe('assert-log', function() {
  it('Works synchronously', function() {
    const log = makeAssertLog()
    log('a')
    log('b')

    // Single entry:
    log.read(1).assert('a')

    // Remaining entries:
    expect(log.read()).to.deep.equal(['b'])
  })

  it('Throws pretty errors', function() {
    const log = makeAssertLog()
    log('a')
    log('b')
    expect(() => log.read().assert('a')).throws(
      'expected ["a"] to match ["a","b"]'
    )
  })

  it('Works asynchronously', function() {
    const promises: Array<Promise<void>> = []
    const log = makeAssertLog({ timeout: 100 })

    // Consume one event:
    log('a')
    log('b')
    promises.push(log.waitFor(1).assert('a'))
    log.assert('b')

    // Consume all available events, then wait for more:
    log('start')
    setTimeout(() => log('timeout 1'), 10)
    setTimeout(() => log('timeout 2'), 10)
    promises.push(log.waitFor(3).assert('start', 'timeout 1', 'timeout 2'))
    log.assert()

    // Timeout:
    promises.push(log.waitFor(1).assert())

    // Now wait:
    return Promise.all(promises)
  })
})
