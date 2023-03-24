import config from '../config/rest-shield-config.json'
import admin from 'firebase-admin'
import PocketBase from 'pocketbase'
import DatabaseManaging from './interfaces/DatabaseManaging'
import { RepositoriesRecord, RepositoriesResponse, RepositoryAttributesRecord, RepositoryAttributesResponse, UsersRecord, UsersResponse } from '../database/pocketbase-types'

const serviceAccount = require(config.firebase_service_acc_key_location)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

class DatabaseManager implements DatabaseManaging {
  private static pocketbase = new PocketBase(process.env.DATABASE)
  private static firestore = admin.firestore()
  rootPath: string

  constructor(rootPath: string = config.db_root_path) {
    this.rootPath = rootPath
  }

  getUser(username: string) {
    return DatabaseManager.pocketbase.collection('users').getFirstListItem(`username=${username}`) as unknown as UsersResponse
  }

  getRepository(userId: string, repositoryName: string) {
    return DatabaseManager.pocketbase.collection('repositories').getFirstListItem(`user=${userId} && title=${repositoryName}`) as unknown as RepositoriesResponse
  }

  getRepositoryAttribute(repositoryId: string, attributeType: string) {
    return DatabaseManager.pocketbase.collection('repositories').getFirstListItem(`repository=${repositoryId} && attribute_type=${attributeType}`) as unknown as RepositoryAttributesResponse
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
