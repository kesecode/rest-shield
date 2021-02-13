interface DatabaseManaging {
  setDocument(collectionPath: string, document: string, data: object): Promise<FirebaseFirestore.Timestamp>

  getDocument(collectionPath: string, document: string): Promise<FirebaseFirestore.DocumentData | undefined>
}
export default DatabaseManaging
