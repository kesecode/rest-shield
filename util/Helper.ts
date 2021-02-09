class Helper {
  parseCoverage(data: any) {
    const obj = JSON.parse(data)
    return obj.coverage
  }

  createShieldResponse(coverage: Number): object {
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
}
export default Helper
