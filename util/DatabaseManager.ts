import ServerLogger from './ServerLogger'
const log = ServerLogger.getChildLog()
import config from '../config/rest-shield-config.json'
const serviceAccount = require(config.firebase_service_acc_key_location)
import admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

class DatabaseManager {
  private static firestore = admin.firestore()

  async updateDocument(collectionPath: string, document: string, data: object) {
    const docRef = DatabaseManager.firestore.collection(collectionPath).doc(document)
    await docRef.set(data)
  }

  async getDocument(collectionPath: string, document: string) {
    const docRef = DatabaseManager.firestore.collection(collectionPath).doc(document)
    const doc = await docRef.get()
    return doc
  }
}
export default DatabaseManager
