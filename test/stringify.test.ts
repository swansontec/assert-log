import { expect } from 'chai'
import { describe, it } from 'mocha'

import { stringify } from '../src/stringify'

class MyClass {
  x: number
  constructor() {
    this.x = 1
  }
}

describe('stringify', function() {
  it('Handles primitives', function() {
    expect(stringify('a')).equals('"a"')
    expect(stringify(1)).equals('1')
    expect(stringify(true)).equals('true')
    expect(stringify(false)).equals('false')
    expect(stringify(null)).equals('null')
    expect(stringify(undefined)).equals('undefined')
    expect(stringify(Symbol('interrobang'))).equals('Symbol(interrobang)')
  })

  it('Handles array-like objects', function() {
    expect(stringify(['a', 1])).equals('["a", 1]')
    expect(stringify(Uint8Array.from([0xff, 0]))).equals('[255, 0]')
    // eslint-disable-next-line no-new-wrappers
    expect(stringify(new String('hi'))).equals('["h", "i"]')

    const sparse = []
    sparse[2] = '?'
    expect(stringify(sparse)).equals('{ 2: "?" }')

    const extra = Object.assign([0], { foo: 'foo' })
    expect(stringify(extra)).equals('{ 0: 0, foo: "foo" }')
  })

  it('Handles objects', function() {
    // Special cases:
    expect(stringify(new Date('2017'))).equals('2017-01-01T00:00:00.000Z')
    expect(stringify(new Error('boom'))).equals('Error: boom')

    // Object syntax:
    expect(stringify({})).equals('{}')
    expect(stringify({ a: 1, b: false })).equals('{ a: 1, b: false }')
    expect(stringify(new MyClass())).equals('{ x: 1 }')
  })

  it('Handles recursion', function() {
    const x: { a: object[] } = { a: [] }
    x.a[0] = x
    x.a[1] = x.a

    expect(stringify(x)).equals('{ a: [parent2, parent1] }')
  })
})
