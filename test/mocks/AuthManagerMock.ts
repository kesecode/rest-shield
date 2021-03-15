import AuthManaging from '../../model/interfaces/AuthManaging'
import jwt, { SignCallback, VerifyCallback } from 'jsonwebtoken'
import secret_key from '../../secrets/secret_key.json'

class AuthManagerMock implements AuthManaging {
  static success: boolean
  constructor(success = true) {
    AuthManagerMock.success = success
  }

  verify(token: string, handler: VerifyCallback) {
    jwt.verify(token, secret_key.secret, handler)
  }

  verifyToken(req: any, res: any, next: () => any) {
    if (!AuthManagerMock.success) {
      return res.status(403).json({ error: 'ERROR' })
    } else {
      next()
    }
  }

  login(req: any, res: any, next: () => any) {
    if (AuthManagerMock.success) {
      res.status(200).json({ token: 'SUCCESS' })
      next()
    } else {
      res.status(403).json({ error: 'ERROR' })
    }
  }
}
export default AuthManagerMock
