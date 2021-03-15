import RepositoryAttributeType from '../enums/RepositoryAttributeType'
import RepositoryAttribute from '../interfaces/RepositoryAttribute'
import ShieldFactory from '../factories/ShieldFactory'
import ShieldBadgeColor from '../enums/ShieldBadgeColor'
import ShieldBadge from '../interfaces/ShieldBadge'

class Coverage implements RepositoryAttribute {
  value: any
  lastUpdated: Date
  type: RepositoryAttributeType

  constructor(value: any, date?: Date) {
    this.value = value
    date ? (this.lastUpdated = date) : (this.lastUpdated = new Date())
    this.type = RepositoryAttributeType.coverage
  }

  getShieldIoJSON(): ShieldBadge {
    if (typeof this.value === 'number') {
      let color = ShieldBadgeColor.brightgreen
      if (this.value < 95) color = ShieldBadgeColor.green
      if (this.value < 80) color = ShieldBadgeColor.yellowgreen
      if (this.value < 70) color = ShieldBadgeColor.yellow
      if (this.value < 60) color = ShieldBadgeColor.orange
      if (this.value < 50) color = ShieldBadgeColor.red
      return new ShieldFactory().makeShieldBadge('coverage', `${this.value}%`, color)
    } else {
      throw new Error('Given coverage value is not valid')
    }
  }
}
export default Coverage
