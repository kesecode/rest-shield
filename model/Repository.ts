import DatabaseManager from '../util/DatabaseManager'
import config from '../config/rest-shield-config.json'
import DatabaseManaging from '../util/util-interfaces/DatabaseManaging'
import DatabaseManagerMock from '../test/unit-test/mocks/DatabaseManagerMock'

class Repository {
  private username: string
  private repository: string
  private rootPath: string
  private databaseManager: DatabaseManaging

  constructor(username: string, repository: string, databaseManager: DatabaseManaging = new DatabaseManager()) {
    this.repository = repository
    this.username = username
    // Determine if environment == production || test
    if (process.env.SHIELD_UNIT_TEST === 'true') {
      this.rootPath = 'TEST'
      this.databaseManager = new DatabaseManagerMock()
    } else {
      this.rootPath = process.env.SHIELD_INTEGRATION_TEST_ROOTPATH || config.db_root_path
      this.databaseManager = databaseManager
    }
  }

  setCoverage(json: string) {
    const coverage = Math.floor(this.parseCoverage(json) * 100)
    this.databaseManager
      .setDocument(`${this.rootPath}/${this.username}/repositories`, `${this.repository}`, {
        coverage: coverage,
        last_updated: new Date().toString(),
      })
      .catch(err => {
        throw new Error(`Coverage update failed ${err}`)
      })
  }

  async getCoverage(): Promise<number> {
    return this.parseCoverage(await this.fetchData())
  }

  async fetchData(): Promise<string> {
    return JSON.stringify(
      await this.databaseManager.getDocument(`${this.rootPath}/${this.username}/repositories/`, `${this.repository}`),
    )
  }

  async getShieldIoJsonResponse(): Promise<object> {
    try {
      let coverage = await this.getCoverage()
      let color = 'brightgreen'
      if (coverage < 95) color = 'green'
      if (coverage < 80) color = 'yellowgreen'
      if (coverage < 70) color = 'yellow'
      if (coverage < 60) color = 'orange'
      if (coverage < 50) color = 'red'

      return {
        schemaVersion: 1,
        label: 'coverage',
        message: String(coverage) + '%',
        color: color,
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  parseCoverage(data: string): number {
    const obj = JSON.parse(data)
    try {
      return +obj.coverage
    } catch (error) {
      throw new Error('Invalid data')
    }
  }
}
export default Repository
