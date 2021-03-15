interface DatabaseManaging {
  rootPath: string

  setDocument(collectionPath: string, document: string, data: object): void

  getDocument(collectionPath: string, document: string): Promise<FirebaseFirestore.DocumentData | undefined>
}
export default DatabaseManaging
