import ShieldBadgeColor from '../enums/ShieldBadgeColor'
import ShieldBadge from '../interfaces/ShieldBadge'

class ShieldFactory {
  makeShieldBadge(label: string, message: string, color: ShieldBadgeColor): ShieldBadge {
    return {
      schemaVersion: 1,
      label: label,
      message: message,
      color: color,
    }
  }
}
export default ShieldFactory
