import { SignCallback, VerifyCallback } from 'jsonwebtoken'

interface AuthManaging {
  verify(token: string, handler: VerifyCallback): void

  verifyToken(req: any, res: any, next: () => any): void

  login(username: string, password: string, handle: SignCallback): void
}
export default AuthManaging
