const FEATURE_NAMES = {
  portal: 'Developer Portal',
  finance: 'Billing',
  settings: 'Settings',
  partners: 'Developer Accounts -- Applications',
  monitoring: 'Analytics',
  plans: 'Integration & Application Plans'
}

export function getFeatureName (feature) {
  if (feature in FEATURE_NAMES) {
    return FEATURE_NAMES[feature]
  }

  throw new Error(`${feature} is not a known feature`)
}
