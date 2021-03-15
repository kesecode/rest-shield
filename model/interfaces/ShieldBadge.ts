import ShieldBadgeColor from '../enums/ShieldBadgeColor'

interface ShieldBadge {
  schemaVersion: number
  label: string
  message: string
  color: ShieldBadgeColor
}
export default ShieldBadge
