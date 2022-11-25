import path from 'path'
import Repository from '../Repository'
import express, { Router } from 'express'
import DatabaseManaging from '../interfaces/DatabaseManaging'
import DatabaseManager from '../DatabaseManager'
import RepositoryAttributeType from '../enums/RepositoryAttributeType'
import { refreshToken } from 'firebase-admin/app'

class GetRouterFactory {
  databaseManager: DatabaseManaging
  router = express.Router()

  constructor(databaseManager: DatabaseManaging = new DatabaseManager()) {
    this.databaseManager = databaseManager
  }

  makeRouter(): Router {
    this.router.get('/', (req: any, res: any) => {
      res.status(200)
      res.sendFile(path.join(__dirname, '../../../landing-page/index.html'));
      return res
    })
    this.router.get('/:username/:repo/:attribute', async (req: any, res: any) => {
      try {
        let data = await new Repository(req.params.username, req.params.repo, this.databaseManager).getShieldIoJSON(
          (<any>RepositoryAttributeType)[req.params.attribute],
        )
        if (data) {
          res.status(200).json(data)
        } else {
          res.status(204).json({ response: 'Attribute not found' })
        }
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: String(error) })
      }
    })
    return this.router
  }
}

export default GetRouterFactory
