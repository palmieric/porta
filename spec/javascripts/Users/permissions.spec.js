/** @jsx element */

import $ from 'jquery'
import { dom, element } from 'decca' // eslint-disable-line no-unused-vars

import {
  ServiceAccessList,
  AdminSection,
  ServiceAccess,
  Form
} from 'Users/permissions'

function render (el, context = {}, dispatch) {
  let doc = document.createDocumentFragment()
  let render = dom.createRenderer(doc, dispatch)
  render(el, context)

  return doc.firstChild
}

describe('ServiceAccessList', function () {
  const noServicePermissionsGranted = 'ServiceAccessList--noServicePermissionsGranted'

  it('toggles no service permissions granted class', function () {
    let list = (sections) => {
      let node = render(<ServiceAccessList />, { admin_sections: sections })
      return $(node).find('.ServiceAccessList')
    }

    expect(list([])).toHaveClass(noServicePermissionsGranted)
    expect(list(['portal'])).toHaveClass(noServicePermissionsGranted)
    expect(list(['services'])).toHaveClass(noServicePermissionsGranted)
    expect(list(['finance'])).toHaveClass(noServicePermissionsGranted)
    expect(list(['partners'])).not.toHaveClass(noServicePermissionsGranted)
  })

  it('renders children', function () {
    let node = render(<ServiceAccessList><li id='child'/></ServiceAccessList>)

    expect(node).toContainElement('ol > li#child')
  })
})

describe('AdminSection', function () {
  const isUnavailable = 'is-unavailable'

  it('renders correct class', function () {
    let node = render(<AdminSection name='portal'/>)

    expect(node).toHaveClass('ServiceAccessList-sectionItem--portal')
  })

  it('is available', function () {
    let node = render(<AdminSection name='portal'/>, { admin_sections: ['portal'] })

    expect(node).not.toHaveClass(isUnavailable)
  })

  it('is available', function () {
    let node = render(<AdminSection name='portal'/>, { admin_sections: ['partners'] })

    expect(node).toHaveClass(isUnavailable)
  })

  it('renders children', function () {
    let node = render(<AdminSection>Foobar</AdminSection>)

    expect(node).toHaveText('Foobar')
  })
})

describe('ServiceAccess', function () {
  const service = { id: 6, name: '3scale Inc.' }

  it('renders name', function () {
    let node = render(<ServiceAccess service={service}/>)

    expect(node).toContainText(service.name)
  })

  it('renders input', function () {
    let node = render(<ServiceAccess service={service}/>)

    expect(node)
      .toContainElement('input[type=checkbox][name="user[member_permission_service_ids][]"][value=6]')
  })

  it('renders disabled', function () {
    let disabled = 'input[disabled]'
    let state = {}
    let node = () => render(<ServiceAccess/>, state)

    // all services are enabled, so individual checkboxes are disabled
    expect(node()).toContainElement(disabled)

    // only some (or none) services are enabled, so nothing is disabled
    state.admin_sections = ['services']
    expect(node()).not.toContainElement(disabled)

    // no services are enabled
    state.member_permission_service_ids = []
    expect(node()).not.toContainElement(disabled)

    state.admin_sections = undefined
    expect(node()).toContainElement(disabled)
  })

  it('renders checked', function () {
    let checked = 'input:checked'
    let state = {}
    let node = () => render(<ServiceAccess service={service}/>, state)

    // all services are enabled
    expect(node()).toContainElement(checked, 'all services enabled - element checked')

    // prerequisite for the following two tests
    state.admin_sections = ['services']

    // no services are enabled
    state.member_permission_service_ids = []
    expect(node()).not.toContainElement(checked, 'no services are enabled - element not checked')

    // only specific services are enabled
    state.member_permission_service_ids.push(service.id)
    expect(node()).toContainElement(checked, 'current service is enabled - element checked')
  })

  it('adds services', function () {
    let dispatch = jasmine.createSpy('dispatch')
    let node = render(<ServiceAccess service={service}/>, { member_permission_service_ids: [], admin_sections: ['services'] }, dispatch)

    $('.user_member_permission_service_ids', node).change()

    expect(dispatch).toHaveBeenCalledWith({ member_permission_service_ids: [service.id] })
  })

  it('removes services', function () {
    let dispatch = jasmine.createSpy('dispatch')
    let node = render(<ServiceAccess service={service}/>, { member_permission_service_ids: [service.id] }, dispatch)

    $('.user_member_permission_service_ids', node).change()

    expect(dispatch).toHaveBeenCalledWith({ member_permission_service_ids: [] })
  })
})

describe('Form', () => {
  it('render the given features', () => {
    const FEATURES = ['portal', 'finance']
    let node = render(<Form services={[]} features={FEATURES}/>, {})

    expect(node).toContainText('Developer Portal')
    expect(node).toContainElement('input#user_member_permission_ids_portal')
    expect(node).toContainText('Billing')
    expect(node).toContainElement('input#user_member_permission_ids_finance')
    expect(node).not.toContainText('Analytics')
  })
})
