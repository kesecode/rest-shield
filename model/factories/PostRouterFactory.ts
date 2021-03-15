import { Router } from 'express'
import AuthManager from '../AuthManager'
import Repository from '../Repository'
import express from 'express'
import AuthManaging from '../interfaces/AuthManaging'
import DatabaseManaging from '../interfaces/DatabaseManaging'
import DatabaseManager from '../DatabaseManager'
import RepositoryAttributeType from '../enums/RepositoryAttributeType'

class PostRouterFactory {
  authManager: AuthManaging
  databaseManager: DatabaseManaging
  router = express.Router()

  constructor(authManager: AuthManaging = new AuthManager(), databaseManager: DatabaseManaging = new DatabaseManager()) {
    this.authManager = authManager
    this.databaseManager = databaseManager
  }

  makeRouter(): Router {
    this.router.post('/:username/:repo/:attribute', this.authManager.verifyToken, (req: any, res: any) => {
      this.authManager.verify(req.token, error => {
        if (error) {
          return res.sendStatus(403)
        } else {
          try {
            let repo = new Repository(req.params.username, req.params.repo, this.databaseManager)
            repo.updateRepositoryAttribute(
              repo.createRepositoryAttribute(JSON.parse(req.headers['json']).value, (<any>RepositoryAttributeType)[req.params.attribute]),
            )
            return res.status(200).send('Success')
          } catch (error) {
            console.error(error)
            return res.status(500).json({ error: String(error) })
          }
        }
      })
    })
    return this.router
  }
}
export default PostRouterFactory
