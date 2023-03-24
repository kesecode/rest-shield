import { Collections, RepositoriesRecord, RepositoriesResponse, RepositoryAttributesRecord, RepositoryAttributesResponse, UsersRecord, UsersResponse } from "../../database/pocketbase-types"

interface DatabaseManaging {
  rootPath: string

  getUser(username: string): UsersResponse

  getRepository(userId: string, repositoryName: string): RepositoriesResponse

  getRepositoryAttribute(repositoryId: string, attributeType: string): RepositoryAttributesResponse

  setDocument(collectionPath: string, document: string, data: object): void

  getDocument(collectionPath: string, document: string): Promise<FirebaseFirestore.DocumentData | undefined>
}
export default DatabaseManaging
