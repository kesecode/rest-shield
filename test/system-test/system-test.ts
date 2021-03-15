import request from 'supertest'
import expect from 'chai'
import express, { Router } from 'express'
import config from '../../config/rest-shield-config.json'
import test_credentials from '../../secrets/test_credentials.json'
import AuthRouterFactory from '../../model/factories/AuthRouterFactory'
import PostRouterFactory from '../../model/factories/PostRouterFactory'
import GetRouterFactory from '../../model/factories/GetRouterFactory'
import DatabaseManager from '../../model/DatabaseManager'
import * as http from 'http'
import sinon from 'sinon'

const api = express()

describe('System-test: Test routes with full firebase integration', () => {
  const randomizedCoverage = Math.floor(Math.random() * 100)
  let server: http.Server

  before(done => {
    sinon.stub(console, 'log') // disable console.log
    sinon.stub(console, 'info') // disable console.info
    sinon.stub(console, 'warn') // disable console.warn
    sinon.stub(console, 'error') // disable console.error

    server = api.listen(3002, () => {})

    let authRouter = new AuthRouterFactory().makeRouter()
    let postRouter = new PostRouterFactory(undefined, new DatabaseManager(config.test_db_root_path)).makeRouter()
    let getRouter = new GetRouterFactory(new DatabaseManager(config.test_db_root_path)).makeRouter()

    api.use('/auth', authRouter)
    api.use('/post', postRouter)
    api.use('/get', getRouter)

    done()
  })

  beforeEach(done => setTimeout(done, 250))

  after(() => {
    new DatabaseManager(config.test_db_root_path).deleteDocument(test_credentials.user)
    server.close()
    sinon.restore()
  })

  it(`should authenticate via /auth with ${test_credentials.user}`, done => {
    request(api)
      .post('/auth')
      .set({
        authorization: `${test_credentials.user} ${test_credentials.password}`,
      })
      .then(res => {
        let data = JSON.parse(res.text)
        expect.assert(data.token !== null && data.token.length > 80)
        done()
      })
  })

  it('should authenticate via /auth and post randomized coverage via /post and testUser/testRepo', done => {
    request(api)
      .post('/auth')
      .set({
        authorization: `${test_credentials.user} ${test_credentials.password}`,
      })
      .then(res => {
        let data = JSON.parse(res.text)
        request(api)
          .post('/post/testUser/testRepo/coverage')
          .set({ json: `{"value": ${randomizedCoverage}}` })
          .set({ Authorization: `Bearer ${data.token}` })
          .then(res => {
            expect.assert(JSON.parse(JSON.stringify(res)).status === 200)
            done()
          })
      })
  })

  it('should get shield.io conform JSON with correct expected result', () => {
    let color = 'brightgreen'
    let expectedCoverage = Math.floor(randomizedCoverage * 100)
    if (expectedCoverage < 95) color = 'green'
    if (expectedCoverage < 80) color = 'yellowgreen'
    if (expectedCoverage < 70) color = 'yellow'
    if (expectedCoverage < 60) color = 'orange'
    if (expectedCoverage < 50) color = 'red'

    let expectedResult = {
      schemaVersion: 1,
      label: 'coverage',
      message: String(expectedCoverage) + '%',
      color: color,
    }

    request(api)
      .get('/get/testUser/testRepo/coverage')
      .then(res => {
        let result = JSON.parse(JSON.parse(JSON.stringify(res)).text)
        expect.assert(expectedResult === result)
      })
  })
})

describe('System-test with errors: Test "authManager" errors', () => {
  const randomizedCoverage = Math.floor(Math.random() * 100)
  let server: http.Server

  before(done => {
    sinon.stub(console, 'log') // disable console.log
    sinon.stub(console, 'info') // disable console.info
    sinon.stub(console, 'warn') // disable console.warn
    sinon.stub(console, 'error') // disable console.error

    server = api.listen(3002, () => {})

    let authRouter = new AuthRouterFactory().makeRouter()
    let postRouter = new PostRouterFactory(undefined, new DatabaseManager(config.db_root_path)).makeRouter()
    let getRouter = new GetRouterFactory(new DatabaseManager()).makeRouter()

    api.use('/auth', authRouter)
    api.use('/post', postRouter)
    api.use('/get', getRouter)

    done()
  })

  beforeEach(done => setTimeout(done, 250))

  after(() => {
    new DatabaseManager().deleteDocument(test_credentials.user)
    server.close()
    sinon.restore()
  })

  it('should get a 500', done => {
    request(api)
      .post('/auth')
      .then(res => {
        let data = JSON.parse(res.text)
        expect.assert(res.status === 500)
        done()
      })
  })

  it('should get a 403 for missing bearer', done => {
    request(api)
      .post('/auth')
      .set({
        authorization: `${test_credentials.user} ${test_credentials.password}`,
      })
      .then(res => {
        let data = JSON.parse(res.text)
        request(api)
          .post('/post/testUser/testRepo/coverage')
          .set({ json: `{"value": ${randomizedCoverage}}` })
          .then(res => {
            expect.assert(res.status === 403)
            done()
          })
      })
  })

  it('should get a 403 for wrong credentials', done => {
    request(api)
      .post('/auth')
      .set({
        authorization: `wrong credentials`,
      })
      .then(res => {
        let data = JSON.parse(res.text)
        request(api)
          .post('/post/testUser/testRepo/coverage')
          .set({ json: `{"value": ${randomizedCoverage}}` })
          .set({ Authorization: `Bearer ${data.token}` })
          .then(res => {
            expect.assert(res.status === 403)
            done()
          })
      })
  })

  it('should fail beacause of non-implemented attribute', done => {
    request(api)
      .post('/auth')
      .set({
        authorization: `${test_credentials.user} ${test_credentials.password}`,
      })
      .then(res => {
        let data = JSON.parse(res.text)
        request(api)
          .post('/post/testUser/testRepo/notexisting')
          .set({ json: `{"value": ${randomizedCoverage}}` })
          .set({ Authorization: `Bearer ${data.token}` })
          .then(res => {
            expect.assert(res.status === 500)
            done()
          })
      })
  })
})
