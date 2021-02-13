import config from '../config/rest-shield-config.json'
import { Logger } from 'tslog'

class ServerLogger {
  private static log = new Logger({
    suppressStdOutput: config.suppress_log_output,
  })

  static getChildLog(): Logger {
    return this.log.getChildLogger()
  }
}
export default ServerLogger
