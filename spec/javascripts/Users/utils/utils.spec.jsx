import { isServicePermissionsGranted, toggleElementInCollection } from 'Users/utils'

describe('isServicePermissionsGranted', () => {
  it('should return whether or not service permissions are available', () => {
    // ['portal', 'finance', 'settings', 'partners', 'monitoring', 'plans']

    expect(isServicePermissionsGranted('portal')).toBe(false)
    expect(isServicePermissionsGranted('finance')).toBe(false)
    expect(isServicePermissionsGranted('settings')).toBe(false)

    expect(isServicePermissionsGranted('partners')).toBe(true)
    expect(isServicePermissionsGranted('monitoring')).toBe(true)
    expect(isServicePermissionsGranted('plans')).toBe(true)

    expect(isServicePermissionsGranted(['portal', 'finance', 'settings'])).toBe(false)

    expect(isServicePermissionsGranted(['portal', 'partners'])).toBe(true)
    expect(isServicePermissionsGranted(['plans', 'partners'])).toBe(true)
  })
})

describe('toggleElementInCollection', () => {
  it('should add element if not present in collection', () => {
    const el = 'c'
    const collection = ['a', 'b']

    expect(toggleElementInCollection(el, collection)).toContain(el)
  })

  it('should remove element if present in collection', () => {
    const el = 'c'
    const collection = ['a', 'b', 'c']

    expect(toggleElementInCollection(el, collection)).not.toContain(el)
  })
})
