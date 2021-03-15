import Repository from '../../model/Repository'
import expect from 'chai'
import DatabaseManagerMock from '../mocks/DatabaseManagerMock'

describe('Unit-test: repository', () => {
  beforeEach(done => setTimeout(done, 250))

  it('should initialise a repository', done => {
    let repo = new Repository('testUser', 'testRepo', new DatabaseManagerMock())
    expect.assert(repo !== undefined)
    done()
  })

  it('should persist repository', done => {
    let repo = new Repository('testUser', 'testRepo', new DatabaseManagerMock())
    expect
      .expect(() => {
        repo.persistRepository()
      })
      .to.not.throw(Error)
    done()
  })

  it('should throw error while persisting repository', done => {
    let repo = new Repository('testUser', 'testRepo', new DatabaseManagerMock('undefined', true))
    try {
      repo.persistRepository()
    } catch (error) {
      expect.assert(error !== undefined)
    }
    done()
  })

  it('should throw error while creating a repository attribute cause value == undefined', done => {
    let repo = new Repository('testUser', 'testRepo', new DatabaseManagerMock('undefined', true))
    expect
      .expect(() => {
        repo.createRepositoryAttribute(undefined, 'coverage')
      })
      .to.throw(Error, 'Given attribute value is undefined')
    done()
  })

  it('should throw error while creating a repository attribute cause type does not exist', done => {
    let repo = new Repository('testUser', 'testRepo', new DatabaseManagerMock('undefined', true))
    expect
      .expect(() => {
        repo.createRepositoryAttribute('something', 'notexisting')
      })
      .to.throw(Error, 'Cannot find a implementation for the given RepositoryAttributeType: notexisting')
    done()
  })

  it('should throw error while deserializing a repository attribute cause type does not exist', done => {
    let repo = new Repository('testUser', 'testRepo', new DatabaseManagerMock('undefined', true))

    expect
      .expect(() => {
        repo.deserializeRepositoryAttributes(`[{"value":75,"lastUpdated":"2021-02-15T17:01:04.199Z","type":"notexisting"}]`)
      })
      .to.throw(Error, 'Cannot find a implementation for the given RepositoryAttributeType: notexisting')
    done()
  })
})
