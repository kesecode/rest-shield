import config from '../config/rest-shield-config.json'
import admin from 'firebase-admin'
import DatabaseManaging from './interfaces/DatabaseManaging'

const serviceAccount = require(config.firebase_service_acc_key_location)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

class DatabaseManager implements DatabaseManaging {
  private static firestore = admin.firestore()
  rootPath: string

  constructor(rootPath: string = config.db_root_path) {
    this.rootPath = rootPath
  }

  setDocument(collectionPath: string, document: string, data: object) {
    DatabaseManager.firestore.collection(`${this.rootPath}/${collectionPath}`).doc(document).set(data)
  }

  async getDocument(collectionPath: string, document: string): Promise<FirebaseFirestore.DocumentData | undefined> {
    return (await DatabaseManager.firestore.collection(`${this.rootPath}/${collectionPath}`).doc(document).get()).data()
  }

  deleteDocument(document: string) {
    DatabaseManager.firestore.collection(`${this.rootPath}`).doc(document).delete()
  }
}
export default DatabaseManager
