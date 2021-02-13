import DatabaseManaging from '../../../util/util-interfaces/DatabaseManaging'

class DatabaseManagerMock implements DatabaseManaging {
  async setDocument(collectionPath: string, document: string, data: object): Promise<FirebaseFirestore.Timestamp> {
    //todo
    return new FirebaseFirestore.Timestamp(0, 25)
  }

  async getDocument(collectionPath: string, document: string): Promise<FirebaseFirestore.DocumentData | undefined> {
    //todo
    let returnMock: FirebaseFirestore.DocumentData
    returnMock = {}
    return returnMock
  }
}
export default DatabaseManagerMock
