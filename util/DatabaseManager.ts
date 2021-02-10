import config from '../config/rest-shield-config.json'
import ServerLogger from './ServerLogger'
import admin from 'firebase-admin'
const serviceAccount = require(config.firebase_service_acc_key_location)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

class DatabaseManager {
  private static firestore = admin.firestore()

  async updateDocument(collectionPath: string, document: string, data: object): Promise<FirebaseFirestore.WriteResult> {
    const docRef = DatabaseManager.firestore.collection(collectionPath).doc(document)
    return await docRef.set(data)
  }

  async getDocument(collectionPath: string, document: string): Promise<FirebaseFirestore.DocumentData> {
    const docRef = DatabaseManager.firestore.collection(collectionPath).doc(document)
    return await docRef.get()
  }
}
export default DatabaseManager
