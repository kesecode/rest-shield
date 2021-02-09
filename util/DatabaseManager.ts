import ServerLogger from "./ServerLogger";
const log = ServerLogger.getChildLog();
import config from "../config/rest-shield-config.json";
const serviceAccount = require(config.firebase_service_acc_key_location);
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class DatabaseManager {
  private static firestore = admin.firestore();

  updateDocument(collection: string, document: string, data: object) {
    const docRef = DatabaseManager.firestore
      .collection(collection)
      .doc(document);
    docRef.update(data);
  }

  async getDocument(collection: string, document: string) {
    const docRef = DatabaseManager.firestore
      .collection(collection)
      .doc(document);
    const doc = await docRef.get();
    console.log(doc)
    return doc;
  }
}
export default DatabaseManager;
