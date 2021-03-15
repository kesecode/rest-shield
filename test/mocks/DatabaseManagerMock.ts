import DatabaseManager from '../../model/DatabaseManager'
import DatabaseManaging from '../../model/interfaces/DatabaseManaging'

class DatabaseManagerMock implements DatabaseManaging {
  rootPath: string
  static success: boolean

  constructor(rootPath: string = 'TEST', success = true) {
    this.rootPath = rootPath
    DatabaseManagerMock.success = success
  }

  async setDocument(collectionPath: string, document: string, data: object) {
    if (!DatabaseManagerMock.success) {
      throw new Error('Test')
    }
  }

  async getDocument(collectionPath: string, document: string): Promise<FirebaseFirestore.DocumentData | undefined> {
    //todo
    if (DatabaseManagerMock.success) {
      let returnMock: FirebaseFirestore.DocumentData
      returnMock = {}
      return returnMock
    } else throw new Error('Test')
  }
}
export default DatabaseManagerMock
