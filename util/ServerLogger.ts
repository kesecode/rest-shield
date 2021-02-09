import { Logger } from "tslog";
import config from "../config/rest-shield-config.json";

class ServerLogger {
  static log = new Logger({ suppressStdOutput: config.suppress_log_output });

  static getChildLog(): Logger {
    return this.log.getChildLogger();
  }
}
export default ServerLogger;
