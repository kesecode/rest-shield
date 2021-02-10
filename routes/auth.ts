import ServerLogger from '../util/ServerLogger'
import AuthManager from '../util/AuthManager'
import express from 'express'

const router = express.Router()
const authManager = new AuthManager()
const log = ServerLogger.getChildLog()

router.post('/', (req: any, res: any) => {
  const authHeader = req.headers['authorization']
  let username: string, password: string
  if (typeof authHeader !== 'undefined') {
    const auth = authHeader.split(' ')
    username = auth[0]
    password = auth[1]
  } else {
    return res.sendStatus(500)
  }
  authManager.login(username, password, (err: Error | null, token: string | undefined) => {
    if (err) {
      log.warn('LOGIN FAILED', username)
      return res.sendStatus(403)
    } else {
      log.info('TOKEN RETURNED', username)
      res.json({ token })
    }
  })
})

export default router
