import ServerLogger from '../util/ServerLogger'
import Repository from '../model/Repository'
import express from 'express'

const router = express.Router()
const log = ServerLogger.getChildLog()

router.get('/', (req: any, res: any) => {
  return res.send('Hello')
})

router.get('/:username/:repo', async (req: any, res: any) => {
  try {
    res.json(await new Repository(req.params.username, req.params.repo).getShieldResponse())
  } catch (err) {
    log.error(err)
    return res.sendStatus(500)
  }
})

export default router
