import AuthManager from '../AuthManager'
import express, { Router } from 'express'
import AuthManaging from '../interfaces/AuthManaging'

class AuthRouterFactory {
  authManager: AuthManaging
  router = express.Router()

  constructor(authManager: AuthManaging = new AuthManager()) {
    this.authManager = authManager
  }

  makeRouter(): Router {
    this.router.post('/', this.authManager.login)
    return this.router
  }
}

export default AuthRouterFactory
