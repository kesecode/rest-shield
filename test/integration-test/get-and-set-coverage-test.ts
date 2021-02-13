import Repository from '../../model/Repository'
import expect from 'chai'

describe('INTEGRATION: Test firebase connection', () => {
  const randomizedCoverage = Math.floor(Math.random() * 100) / 100

  before(() => {
    process.env.SHIELD_INTEGRATION_TEST_ROOTPATH = 'rest-shield-TEST'
  })

  beforeEach(done => setTimeout(done, 250))

  after(() => {
    delete process.env.SHIELD_INTEGRATION_TEST_ROOTPATH
  })

  it('Post a new coverage value', () => {
    let repo = new Repository('testUser', 'testRepo')
    expect
      .expect(() => {
        repo.setCoverage(`{ "coverage": ${randomizedCoverage}}`)
      })
      .to.not.throw(Error)
  })

  it('Should get the result posted before', async () => {
    let repo = new Repository('testUser', 'testRepo')
    let result = await repo.fetchData()
    expect.assert(repo.parseCoverage(result) === randomizedCoverage * 100)
  })
})
