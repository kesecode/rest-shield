import Repository from '../../model/Repository'
import expect from 'chai'

describe('Test Firebase connection', () => {
  beforeEach(done => setTimeout(done, 250))
  const randomizedResult = Math.floor(Math.random() * 100) / 100
  it('Post a new coverage value', () => {
    let repo = new Repository('testUser', 'testRepo')
    expect
      .expect(() => {
        repo.setCoverage(`{ "coverage": ${randomizedResult}}`, 'test-shield')
      })
      .to.not.throw(Error)
  })

  it('Should get the result posted before', async () => {
    let repo = new Repository('testUser', 'testRepo')
    let result = await repo.fetchData('test-shield')
    expect.assert(repo.parseCoverage(result) === randomizedResult * 100)
  })
})
