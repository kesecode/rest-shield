import ServerLogger from './ServerLogger'
const log = ServerLogger.getChildLog()
import config from '../config/rest-shield-config.json'
const firebaseConfig = require(config.firebase_config_location)
import jwt, { SignCallback, VerifyCallback } from 'jsonwebtoken'
import jwtSecret from '../secrets/jwtSecret.json'
import auth from 'firebase'

class AuthManager {
  private static firebase = auth.initializeApp(firebaseConfig)

  verify(token: string, handler: VerifyCallback) {
    jwt.verify(token, 'secretkey', handler)
  }

  verifyToken(req: any, res: any, next: () => any) {
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
