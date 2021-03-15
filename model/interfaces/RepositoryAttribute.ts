import RepositoryAttributeType from '../enums/RepositoryAttributeType'
import ShieldBadge from './ShieldBadge'

interface RepositoryAttribute {
  value: any
  lastUpdated: Date
  type: RepositoryAttributeType
  getShieldIoJSON(): ShieldBadge
}
export default RepositoryAttribute
