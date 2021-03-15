import RepositoryAttributeType from './enums/RepositoryAttributeType'
import DatabaseManaging from './interfaces/DatabaseManaging'
import RepositoryAttribute from './interfaces/RepositoryAttribute'
import ShieldBadge from './interfaces/ShieldBadge'
import Coverage from './repo-attributes/Coverage'

class Repository {
  private username: string
  private repository: string
  private databaseManager: DatabaseManaging
  private attributes: Set<RepositoryAttribute>

  constructor(username: string, repository: string, databaseManager: DatabaseManaging) {
    this.repository = repository
    this.username = username
    this.databaseManager = databaseManager
    this.attributes = new Set()
  }

  persistRepository() {
    this.databaseManager.setDocument(`${this.username}/repositories`, `${this.repository}`, {
      attributes: JSON.stringify([...this.attributes]),
    })
  }

  async fetchRepository() {
    await this.databaseManager.getDocument(`${this.username}/repositories/`, `${this.repository}`).then(res => {
      if (res) {
        if (res.attributes) {
          this.attributes = new Set<RepositoryAttribute>(this.deserializeRepositoryAttributes(res.attributes))
        }
      }
    })
  }

  deserializeRepositoryAttributes(attributes: string): RepositoryAttribute[] {
    let result: RepositoryAttribute[] = []
    for (let entry of JSON.parse(attributes)) {
      switch (entry.type) {
        case RepositoryAttributeType.coverage:
          result.push(new Coverage(entry.value, entry.date))
          break
        default:
          throw new Error(`Cannot find a implementation for the given RepositoryAttributeType: ${entry.type}`)
      }
    }
    return result
  }

  createRepositoryAttribute(value: any, type: string): RepositoryAttribute {
    if (value) {
      switch (type) {
        case RepositoryAttributeType.coverage:
          return new Coverage(value)
        default:
          throw new Error(`Cannot find a implementation for the given RepositoryAttributeType: ${type}`)
      }
    } else {
      throw new Error(`Given attribute value is undefined`)
    }
  }

  updateRepositoryAttribute(attribute: RepositoryAttribute) {
    this.fetchRepository().then(() => {
      for (let entry of this.attributes.values()) {
        if (entry.type === attribute.type) {
          this.attributes.delete(entry)
          this.attributes.add(attribute)
          break
        }
      }
      if (!this.attributes.has(attribute)) this.attributes.add(attribute)
      this.persistRepository()
    })
  }

  async getShieldIoJSON(type: RepositoryAttributeType): Promise<ShieldBadge | undefined> {
    await this.fetchRepository()
    for (let entry of this.attributes) {
      if (entry.type === type) return entry.getShieldIoJSON()
    }
    return undefined
  }
}
export default Repository
