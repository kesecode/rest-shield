import DatabaseManager from '../util/DatabaseManager'

class Repository {
  username: string
  repository: string
  databaseManager = new DatabaseManager()

  constructor(username: string, repository: string) {
    this.repository = repository
    this.username = username
  }

  setCoverage(json: string) {
    const coverage = Math.floor(this.parseCoverage(json) * 100)
    this.databaseManager
      .setDocument(`shield/${this.username}/repositories`, `${this.repository}`, {
        coverage: coverage,
        last_updated: new Date().toString(),
      })
      .then(result => {
        console.log(`Document updated in ${result.writeTime}`)
      })
      .catch(err => {
        throw new Error(`Coverage update failed ${err}`)
      })
  }

  async getCoverage(): Promise<number> {
    let data = await this.fetchData()
    return +JSON.parse(data).coverage
  }

  async fetchData(): Promise<string> {
    return JSON.stringify(
      await this.databaseManager.getDocument(`shield/${this.username}/repositories/`, `${this.repository}`),
    )
  }

  async getShieldResponse(): Promise<object> {
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

  parseCoverage(data: any) {
    const obj = JSON.parse(data)
    return obj.coverage
  }
}
export default Repository
