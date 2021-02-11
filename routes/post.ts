import ServerLogger from '../util/ServerLogger'
import AuthManager from '../util/AuthManager'
import Repository from '../model/Repository'
import express from 'express'

const log = ServerLogger.getChildLog()
const authManager = new AuthManager()
const router = express.Router()

router.post('/:username/:repo', authManager.verifyToken, (req: any, res: any) => {
  authManager.verify(req.token, err => {
    if (err) {
      return res.sendStatus(403)
    } else {
      try {
        new Repository(req.params.username, req.params.repo).setCoverage(req.headers['json'])
        return res.sendStatus(200)
      } catch (err) {
        log.error(err)
        return res.sendStatus(500)
      }
    }
  })
})

export default router
