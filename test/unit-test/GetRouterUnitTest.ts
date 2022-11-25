import expect from 'chai'
import express from 'express'
import GetRouterFactory from '../../model/factories/GetRouterFactory'
import DatabaseManagerMock from '../mocks/DatabaseManagerMock'
import request from 'supertest'
import sinon from 'sinon'

const api = express()

describe('Unit-test: get-router', () => {
  before(() => {
    sinon.stub(console, 'log') // disable console.log
    sinon.stub(console, 'info') // disable console.info
    sinon.stub(console, 'warn') // disable console.warn
    sinon.stub(console, 'error') // disable console.error
  })

  beforeEach(done => setTimeout(done, 250))

  after(() => {
    sinon.restore()
  })

  it('should get a status 200', done => {
    let router = new GetRouterFactory(new DatabaseManagerMock('test')).makeRouter()
    let server = api.listen(3002, () => {})
    api.use('/', router)

    request(api)
      .get('/')
      .then(res => {
        expect.assert(res.status === 200)
        done()
      })
    server.close()
  })

  it('should get a status 200 or 204 back', done => {
    let router = new GetRouterFactory(new DatabaseManagerMock('test')).makeRouter()
    let server = api.listen(3002, () => {})
    api.use('/', router)

    request(api)
      .get('/testUser/testRepo/someAttribute')
      .then(res => {
        expect.assert(res.status === 200 || res.status === 204)
        done()
      })
    server.close()
  })

  it('should get an 500 error back', done => {
    let router = new GetRouterFactory(new DatabaseManagerMock('test', false)).makeRouter()
    let server = api.listen(3002, () => {})
    api.use('/', router)

    request(api)
      .get('/testUser/testRepo/someAttribute')
      .then(res => {
        expect.assert(res.status === 500)
        done()
      })
    server.close()
  })
})
