/**
 * Copyright 2016 Signal K <info@signalk.org> and contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Parser = require('../lib')
const chai = require('chai')
const nmeaLine = '$IIVPW,4.5,N,6.7,M*52'
const nmeaLineKnots = '$IIVPW,4.5,N,,*30'

chai.Should()
chai.use(require('chai-things'))

describe('VPW', () => {

  it('Converts OK using individual parser', done => {
    const parser = new Parser

    parser.on('signalk:delta', delta => {
      delta.updates[0].values.should.contain.an.item.with.property('path', 'performance.velocityMadeGood')
      delta.updates[0].values.should.contain.an.item.with.property('value', 6.7)


      done()
    })

    parser.parse(nmeaLine)
  })

  it('Converts OK using stream parser if speed in m/s', done => {
    const parser = new Parser
    const stream = parser.stream()

    stream.on('data', result => {
      result.should.be.an.object
      result.should.have.property('delta')
      result.delta.updates[0].values.should.contain.an.item.with.property('path', 'performance.velocityMadeGood')
      result.delta.updates[0].values.should.contain.an.item.with.property('value', 6.7)
      done()
    })

    stream.write(nmeaLine)
  })

  it('Converts OK using stream parser if speed in knots', done => {
    const parser = new Parser
    const stream = parser.stream()

    stream.on('data', result => {
      result.should.be.an.object
      result.should.have.property('delta')
      result.delta.updates[0].values.should.have.all.keys({'path': 'performance.velocityMadeGood', 'value': 6.7})
      done()
    })

    stream.write(nmeaLineKnots)
  })

  /*
  it('Doesn\'t choke on empty sentences', done => {
    new Parser()
    .parse('$IIVPW,,,,*51')
    .then(result => {
      should.equal(result, null)
      done()
    })
    .catch(e => done(e))
  })
  */

})
