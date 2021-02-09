// Imports
import express from 'express'
const router = express.Router()
// Local
import Helper from '../util/Helper'
const helper = new Helper()
import AuthManager from '../util/AuthManager'
const authManager = new AuthManager()
import DatabaseManager from '../util/DatabaseManager'
import ServerLogger from '../util/ServerLogger'
const databaseManager = new DatabaseManager()
const log = ServerLogger.getChildLog()

router.post('/coverage/:username/:repo/', authManager.verifyToken, (req: any, res: any) => {
  authManager.verify(req.token, err => {
    if (err) {
      return res.sendStatus(403)
    } else {
      const json = req.headers['json']
      let coverageValue = Math.floor(helper.parseCoverage(json) * 100)
      databaseManager.updateDocument(`shield/${req.params.username}/repositories`, `${req.params.repo}`, {
        coverage: coverageValue,
      })
      log.info('COVERAGE UPDATED')
      return res.sendStatus(200)
    }
  })
})

export default router
