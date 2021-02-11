import jwt, { SignCallback, VerifyCallback } from 'jsonwebtoken'
import config from '../config/rest-shield-config.json'
import jwtSecret from '../secrets/jwtSecret.json'
import ServerLogger from './ServerLogger'
import auth from 'firebase'
const firebaseConfig = require(config.firebase_config_location)

const log = ServerLogger.getChildLog()

class AuthManager {
  private static firebase = auth.initializeApp(firebaseConfig)

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
    AuthManager.firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then((userCredential: auth.auth.UserCredential) => {
        log.info('LOGIN SUCCESS', userCredential.user?.email)
        // Signed in
        jwt.sign({}, jwtSecret.secret, { expiresIn: config.token_expiration_time }, handle)
      })
      .catch((err: any) => {
        log.warn(err)
        return
      })
  }
}
export default AuthManager
