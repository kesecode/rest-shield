import Repository from '../../model/Repository'
import expect from 'chai'

describe('repository', () => {
  it('should initialise a repository', () => {
    let repo = new Repository('testUser', 'testRepo')
    expect.assert(repo !== undefined)
  })

  it('should parse coverage from JSON string', () => {
    let repo = new Repository('testUser', 'testRepo')
    let coverage = repo.parseCoverage('{ "coverage": 99 }')
    expect.assert(coverage === 99)
  })

  it('should throw an error for invalid JSON', () => {
    expect
      .expect(() => {
        let repo = new Repository('testUser', 'testRepo')
        let error: Error
        repo.parseCoverage({ coverage: 99 })
      })
      .to.throw(Error)
  })
})
