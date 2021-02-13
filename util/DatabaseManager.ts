import config from '../config/rest-shield-config.json'
import ServerLogger from './ServerLogger'
import admin from 'firebase-admin'
import DatabaseManaging from './util-interfaces/DatabaseManaging'
const serviceAccount = require(config.firebase_service_acc_key_location)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

class DatabaseManager implements DatabaseManaging {
  private static firestore = admin.firestore()

  async setDocument(collectionPath: string, document: string, data: object): Promise<FirebaseFirestore.Timestamp> {
    const docRef = DatabaseManager.firestore.collection(collectionPath).doc(document)
    return (await docRef.set(data)).writeTime
  }

  async getDocument(collectionPath: string, document: string): Promise<FirebaseFirestore.DocumentData | undefined> {
    const docRef = DatabaseManager.firestore.collection(collectionPath).doc(document)
    return (await docRef.get()).data()
  }
}
export default DatabaseManager
