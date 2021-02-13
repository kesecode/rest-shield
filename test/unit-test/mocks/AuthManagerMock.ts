import AuthManaging from '../../../util/util-interfaces/AuthManaging'
import jwt, { SignCallback, VerifyCallback } from 'jsonwebtoken'
import config from '../../../config/rest-shield-config.json'
import jwtSecret from '../../../secrets/jwtSecret.json'
import ServerLogger from '../../../util/ServerLogger'

const log = ServerLogger.getChildLog()

class AuthManagerMock implements AuthManaging {
  verify(token: string, handler: VerifyCallback) {
    log.info('verify')
    jwt.verify(token, jwtSecret.secret, handler)
  }

  verifyToken(req: any, res: any, next: () => any) {
    log.info('verifyToken')
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken
      return next()
    } else {
      log.warn('BEARER UNDEFINED')
      return res.sendStatus(403)
    }
  }

  login(username: string, password: string, handle: SignCallback) {
    jwt.sign({}, jwtSecret.secret, { expiresIn: config.token_expiration_time }, handle)
  }
}
export default AuthManagerMock
