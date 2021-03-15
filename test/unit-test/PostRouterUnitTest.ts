import expect from 'chai'
import PostRouterFactory from '../../model/factories/PostRouterFactory'
import AuthManagerMock from '../mocks/AuthManagerMock'
import DatabaseManagerMock from '../mocks/DatabaseManagerMock'

describe('Unit-test: post-router', () => {
  beforeEach(done => setTimeout(done, 250))

  it('should get 200', done => {
    let router = new PostRouterFactory(new AuthManagerMock(true), new DatabaseManagerMock(undefined, true))
    done()
  })

  it('should get 403', done => {
    let router = new PostRouterFactory(new AuthManagerMock(false), new DatabaseManagerMock(undefined, true))
    done()
  })

  it('should 500', done => {
    let router = new PostRouterFactory(new AuthManagerMock(true), new DatabaseManagerMock(undefined, false))
    done()
  })
})
