import DatabaseManager from '../util/DatabaseManager'

class Repository {
  username: string
  repository: string
  databaseManager = new DatabaseManager()

  constructor(username: string, repository: string) {
    this.repository = repository
    this.username = username
  }

  getCoverage(): number {
    let document: any
    try {
      document = this.fetchData()
    } catch (err) {
      throw new Error(err)
    }
    if (typeof document.coverage == 'number') {
      return document.coverage
    } else {
      throw new Error('Coverage data invalid')
    }
  }

  updateCoverage(json: string): any {
    const coverage = Math.floor(this.parseCoverage(json) * 100)
    this.databaseManager
      .updateDocument(`shield/${this.username}/repositories`, `${this.repository}`, {
        coverage: coverage,
        last_updated: new Date().toString(),
      })
      .catch(err => {
        throw new Error(`Coverage update failed ${err}`)
      })
  }

  fetchData(): any {
    this.databaseManager
      .getDocument(`rest-shield/${this.username}/repositories/`, `${this.repository}`)
      .then(document => {
        try {
          return JSON.parse(JSON.stringify(document))
        } catch (err) {
          throw new Error(`Something went wrong while parsing fetched data ${err}`)
        }
      })
      .catch(err => {
        throw new Error(`Repository data fetch failed: ${err}`)
      })
  }

  getShieldResponse(): object {
    let coverage: any
    try {
      coverage = this.getCoverage()
    } catch (err) {
      throw new Error(err)
    }
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
  }

  parseCoverage(data: any) {
    const obj = JSON.parse(data)
    return obj.coverage
  }
}
export default Repository
