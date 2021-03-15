import config from './config/rest-shield-config.json'
import PostRouterFactory from './model/factories/PostRouterFactory'
import GetRouterFactory from './model/factories/GetRouterFactory'
import AuthRouterFactory from './model/factories/AuthRouterFactory'
import express from 'express'
import morgan from 'morgan'

const PORT = config.port
const api = express()

api.listen(PORT, () => {
  console.info('API listens @ port', PORT)
})

let authRouter = new AuthRouterFactory().makeRouter()
let postRouter = new PostRouterFactory().makeRouter()
let getRouter = new GetRouterFactory().makeRouter()

api.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
api.use('/auth', authRouter)
api.use('/post', postRouter)
api.use('/get', getRouter)
