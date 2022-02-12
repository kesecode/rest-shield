import jwt, { VerifyCallback } from 'jsonwebtoken'
import config from '../config/rest-shield-config.json'
import secretKey from '../secrets/secret_key.json'
import firebase from 'firebase/compat/app'
import AuthManaging from './interfaces/AuthManaging'
const firebaseConfig = require(config.firebase_config_location)

class AuthManager implements AuthManaging {
  private static firebaseApp = firebase.initializeApp(firebaseConfig)

  verify(token: string, handler: VerifyCallback) {
    jwt.verify(token, secretKey.secret, handler)
  }

  verifyToken(req: any, res: any, next: () => any) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken
      return next()
    } else {
      return res.status(403).json({ error: 'Bearer undefined' })
    }
  }

  login(req: any, res: any, next: () => any) {
    const authHeader = req.headers['authorization']
    let username: string, password: string
    if (typeof authHeader !== 'undefined') {
      const auth = authHeader.split(' ')
      username = auth[0]
      password = auth[1]
    } else {
      return res.status(500).json({ error: 'Authorization header is missing' })
    }
    AuthManager.firebaseApp
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        jwt.sign({}, secretKey.secret, { expiresIn: config.token_expiration_time }, (_error: Error | null, token: string | undefined) => {
          res.status(200).json({ token })
          next()
        })
      })
      .catch(error => {
        console.error(error.code)
        res.status(403).json({ error })
      })
  }
}
export default AuthManager
