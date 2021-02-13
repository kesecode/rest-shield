import supertest from 'supertest'
import request from 'supertest'
import expect from 'chai'
import express from 'express'
import jwtSecret from '../../secrets/jwtSecret.json'
import postRoutes from '../../routes/post'
import getRoutes from '../../routes/get'
import auth from '../../routes/auth'

const PORT = 3001
const api = express()

describe('INTEGRATION: Test routes with full firebase integration', () => {
  const randomizedCoverage = Math.floor(Math.random() * 100) / 100

  before(done => {
    process.env.SHIELD_INTEGRATION_TEST_ROOTPATH = 'rest-shield-TEST'
    api.listen(3002, () => {})

    api.use('/post', postRoutes)
    api.use('/get', getRoutes)
    api.use('/auth', auth)
    done()
  })

  beforeEach(done => setTimeout(done, 250))

  after(done => {
    delete process.env.SHIELD_INTEGRATION_TEST_ROOTPATH
    done()
  })

  it('Authentication via /auth with test@user.de', done => {
    request(api)
      .post('/auth')
      .set({ authorization: `${jwtSecret.test_user} ${jwtSecret.test_password}` })
      .then(res => {
        let data = JSON.parse(JSON.parse(JSON.stringify(res)).text)
        expect.assert(data.token !== null && data.token.length > 40)
        done()
      })
  })

  it('Authentication via /auth and post randomized coverage via /post and testUser/testRepo', done => {
    request(api)
      .post('/auth')
      .set({ authorization: `${jwtSecret.test_user} ${jwtSecret.test_password}` })
      .then(res => {
        let data = JSON.parse(JSON.parse(JSON.stringify(res)).text)
        request(api)
          .post('/post/testUser/testRepo')
          .set({ json: `{"coverage": ${randomizedCoverage}}` })
          .set({ Authorization: `Bearer ${data.token}` })
          .then(res => {
            expect.assert(JSON.parse(JSON.stringify(res)).status === 200)
            done()
          })
      })
  })

  it('Get shield.io conform JSON with correct expected result', () => {
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
      .get('/get/testUser/testRepo')
      .then(res => {
        let result = JSON.parse(JSON.parse(JSON.stringify(res)).text)
        expect.assert(expectedResult === result)
      })
  })
})
