const FEATURE_NAMES = {
  portal: 'Developer Portal',
  finance: 'Billing',
  settings: 'Settings',
  partners: 'Developer Accounts -- Applications',
  monitoring: 'Analytics',
  plans: 'Integration & Application Plans'
}

const FEATURES_GRANTING_SERVICE_ACCESS = ['partners', 'monitoring', 'plans']

export function getFeatureName (feature) {
  if (feature in FEATURE_NAMES) {
    return FEATURE_NAMES[feature]
  }

  throw new Error(`${feature} is not a known feature`)
}

export function isServicePermissionsGranted (features) {
  if (typeof features === 'string') {
    return FEATURES_GRANTING_SERVICE_ACCESS.includes(features)
  } else {
    return !!features.find(isServicePermissionsGranted)
  }
}
