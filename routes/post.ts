import DatabaseManager from '../util/DatabaseManager'
import ServerLogger from '../util/ServerLogger'
import AuthManager from '../util/AuthManager'
import Helper from '../util/Helper'
import express from 'express'

const databaseManager = new DatabaseManager()
const log = ServerLogger.getChildLog()
const authManager = new AuthManager()
const router = express.Router()
const helper = new Helper()

router.post('/coverage/:username/:repo/', authManager.verifyToken, (req: any, res: any) => {
  authManager.verify(req.token, err => {
    if (err) {
      return res.sendStatus(403)
    } else {
      const json = req.headers['json']
      const coverageValue = Math.floor(helper.parseCoverage(json) * 100)
      databaseManager.updateDocument(`shield/${req.params.username}/repositories`, `${req.params.repo}`, {
        coverage: coverageValue,
      })
      log.info('COVERAGE UPDATED')
      return res.sendStatus(200)
    }
  })
})

export default router
