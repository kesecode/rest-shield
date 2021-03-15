import Repository from '../../model/Repository'
import expect from 'chai'
import DatabaseManager from '../../model/DatabaseManager'
import DatabaseManagerMock from '../mocks/DatabaseManagerMock'
import RepositoryAttribute from '../../model/interfaces/RepositoryAttribute'
import RepositoryAttributeType from '../../model/enums/RepositoryAttributeType'

describe('Integration-test: Create Attribute, save it and get it back', () => {
  const randomizedCoverage = Math.floor(Math.random() * 100)
  let attribute: RepositoryAttribute

  before(() => {})

  beforeEach(done => setTimeout(done, 250))

  after(() => {})

  it('should create a new coverage "RepositoryAttribute"', () => {
    let repo = new Repository('testUser', 'testRepo', new DatabaseManagerMock(undefined, true))
    expect
      .expect(() => {
        attribute = repo.createRepositoryAttribute(randomizedCoverage, 'coverage')
      })
      .to.not.throw(Error)
  })

  it('should update attributes field of repository and get the expected attribute JSON back', async () => {
    let repo = new Repository('testUser', 'testRepo', new DatabaseManagerMock(undefined, true))
    repo.updateRepositoryAttribute(attribute)
    expect.assert(JSON.stringify(await repo.getShieldIoJSON(RepositoryAttributeType.coverage)) == JSON.stringify(attribute.getShieldIoJSON()))
  })
})
