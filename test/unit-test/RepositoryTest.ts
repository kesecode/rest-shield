import Repository from '../../model/Repository'
import expect from 'chai'

describe('UNIT: repository', () => {
  before(() => {
    process.env.SHIELD_UNIT_TEST = 'true'
  })

  after(() => {
    delete process.env.SHIELD_UNIT_TEST
  })

  beforeEach(done => setTimeout(done, 250))

  it('should initialise a repository', done => {
    let repo = new Repository('testUser', 'testRepo')
    expect.assert(repo !== undefined)
    done()
  })

  it('should parse coverage from JSON string', done => {
    let repo = new Repository('testUser', 'testRepo')
    let coverage = repo.parseCoverage('{ "coverage": 99 }')
    expect.assert(coverage === 99)
    done()
  })

  it('should throw an error for invalid JSON', done => {
    expect
      .expect(() => {
        let repo = new Repository('testUser', 'testRepo')
        let error: Error
        repo.parseCoverage('{ coverage: 99 }')
      })
      .to.throw(Error)
    done()
  })
})
