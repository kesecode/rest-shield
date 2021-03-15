import Repository from '../../model/Repository'
import expect from 'chai'
import DatabaseManagerMock from '../mocks/DatabaseManagerMock'

describe('Unit-test: coverage', () => {
  it('should fail because of undefined value', done => {
    let repo = new Repository('testUser', 'testRepo', new DatabaseManagerMock('undefined', true))
    let attribute = repo.createRepositoryAttribute('abc', 'coverage')

    expect
      .expect(() => {
        attribute.getShieldIoJSON()
      })
      .to.throw(Error, 'Given coverage value is not valid')
    done()
  })
})
