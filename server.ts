import config from './config/rest-shield-config.json'
import ServerLogger from './util/ServerLogger'
import postRoutes from './routes/post'
import getRoutes from './routes/get'
import auth from './routes/auth'
import express from 'express'

const log = ServerLogger.getChildLog()

const PORT = config.port
const api = express()

api.listen(PORT, () => {
  log.info('API LISTENING @', PORT)
})

api.use('/api/post', postRoutes)
api.use('/api/get', getRoutes)
api.use('/api/auth', auth)
