// @flow

import type { Feature } from 'Users/types'

const FEATURE_NAMES = {
  portal: 'Developer Portal',
  finance: 'Billing',
  settings: 'Settings',
  partners: 'Developer Accounts -- Applications',
  monitoring: 'Analytics',
  plans: 'Integration & Application Plans'
}

const FEATURES_GRANTING_SERVICE_ACCESS = ['partners', 'monitoring', 'plans']

export function getFeatureName (feature: Feature): string {
  if (feature in FEATURE_NAMES) {
    return FEATURE_NAMES[feature]
  }

  throw new Error(`${feature} is not a known feature`)
}

export function isServicePermissionsGranted (features: string | Array<string>): boolean {
  if (typeof features === 'string') {
    return FEATURES_GRANTING_SERVICE_ACCESS.includes(features)
  } else {
    return !!features.find(isServicePermissionsGranted)
  }
}

export function toggleElementInCollection<T> (el: T, collection: T[]): T[] {
  const i = collection.indexOf(el)

  if (i > -1) {
    collection.splice(i, 1)
  } else {
    collection.push(el)
  }

  return collection
}
