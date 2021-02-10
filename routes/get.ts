import DatabaseManager from '../util/DatabaseManager'
import ServerLogger from '../util/ServerLogger'
import Helper from '../util/Helper'
import express from 'express'

const router = express.Router()
const helper = new Helper()
const databaseManager = new DatabaseManager()
const log = ServerLogger.getChildLog()

router.get('/', (req: any, res: any) => {
  return res.send('Hello')
})

router.get('/coverage/:username/:repo', async (req: any, res: any, next: any) => {
  try {
    const doc = await databaseManager.getDocument(`shield/${req.params.username}/repositories/`, `${req.params.repo}`)
    if (!doc.exists) {
      return res.sendStatus(404)
    } else {
      res.json(helper.createShieldResponse(helper.parseCoverage(JSON.stringify(doc.data()))))
    }
  } catch (error) {
    return next(error)
  }
})

export default router
