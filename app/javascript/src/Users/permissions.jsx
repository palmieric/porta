import React from 'react'
import { render } from 'react-dom'

import 'core-js/fn/object/assign' // make Object.assign on IE 11
import 'core-js/fn/array/includes'

import { Inputs } from 'Users/components/Inputs'
import { RoleInput } from 'Users/components/RoleInput'
import { UserRole } from 'Users/components/UserRole'
import { FeatureAccessInput } from 'Users/components/FeatureAccessInput'
import { FeatureAccess } from 'Users/components/FeatureAccess'
import { getFeatureName, isServicePermissionsGranted } from './utils'

const ServiceFeatureAccess = ({ checked = false, onChange, children }) => {
  let value = 'services'

  let change = () => {
    onChange(value)
  }

  let liClass = `FeatureAccessList-item FeatureAccessList-item--${value} FeatureAccessList--noServicePermissionsGranted`

  // if service feature access checkbox is unchecked
  // at least blank service_ids array has to be sent
  let blankServiceIdsInput = checked ? null : <input type='hidden' name='user[member_permission_service_ids][]' />

  return (
    <li className={liClass}>
      <label htmlFor={`user_member_permission_ids_${value}`}>
        <input
          className='user_member_permission_ids' name='user[member_permission_service_ids]'
          id={`user_member_permission_ids_${value}`} value={''}
          type='checkbox' checked={ checked }
          onChange={ change }
        />{ children }
      </label>
      { blankServiceIdsInput }
    </li>
  )
}

const ServiceAccessList = ({ showServices = false, children }) => {
  let olClass = `ServiceAccessList ${showServices ? '' : 'ServiceAccessList--noServicePermissionsGranted'}`

  return (
    <fieldset>
      <ol className={olClass}>
        { children }
      </ol>
    </fieldset>
  )
}

const AdminSection = ({ name, available = false, children }) => {
  let adminSection = `ServiceAccessList-sectionItem ServiceAccessList-sectionItem--${name} ${available ? '' : 'is-unavailable'}`

  return (
    <li className={adminSection}>
      { children }
    </li>
  )
}

const ServiceAccess = ({ service = {}, checkedFeatures, checked = false, disabled = false, onChange }) => {
  let { id, name } = service

  let toggle = () => {
    onChange(id)
  }
  return (
    <li className='ServiceAccessList-item'>
      <label className='ServiceAccessList-label is-checked'
        htmlFor={`user_member_permission_service_ids_${id}`}>
        <input className='user_member_permission_service_ids'
          id={`user_member_permission_service_ids_${id}`}
          name='user[member_permission_service_ids][]' type='checkbox' value={id}
          checked={checked} disabled={disabled} onChange={toggle}/>
        <span className='ServiceAccessList-labelText'>&nbsp;{ name }</span>
      </label>
      <ul className='ServiceAccessList-sections'>
        <AdminSection name='plans' available={checkedFeatures.includes('plans')}>Integration & Application Plans</AdminSection>
        <AdminSection name='monitoring' available={checkedFeatures.includes('monitoring')}>Analytics</AdminSection>
        <AdminSection name='partners' available={checkedFeatures.includes('partners')}>Applications</AdminSection>
      </ul>
    </li>
  )
}

class Form extends React.Component {
  state = {
    role: this.props.initialState.role || 'admin',
    checkedFeatures: this.props.initialState.admin_sections || [],
    checkedServicesIds: this.props.initialState.member_permission_service_ids || []
  }

  handleRoleChange = (role) => this.setState({ role })

  handleFeatureChecked = (feature) => {
    const { checkedFeatures } = this.state

    const i = checkedFeatures.indexOf(feature)

    if (i > -1) {
      checkedFeatures.splice(i, 1)
    } else {
      checkedFeatures.push(feature)
    }

    this.setState({ checkedFeatures })
  }

  handleServiceChecked = (id: number) => {
    const { checkedServicesIds } = this.state

    const i = checkedServicesIds.indexOf(id)

    if (i > -1) {
      checkedServicesIds.splice(i, 1)
    } else {
      checkedServicesIds.push(id)
    }

    this.setState({ checkedServicesIds })
  }

  get servicePermissionsGranted () {
    return isServicePermissionsGranted(this.state.checkedFeatures)
  }

  get allServicesChecked () {
    return !this.state.checkedFeatures.includes('services')
  }

  render () {
    const { features, services } = this.props
    const { role, checkedFeatures, checkedServicesIds } = this.state

    return (
      <Inputs name='Administrative'>
        <RoleInput>
          <UserRole role='admin' label='Admin (full access)' checked={role === 'admin'} onChange={this.handleRoleChange}/>
          <UserRole role='member' label='Member' checked={role === 'member'} onChange={this.handleRoleChange}/>
        </RoleInput>

        {role === 'member' && (
          <li className='radio optional' id='user_member_permissions_input'>
            <FeatureAccessInput showServices={this.servicePermissionsGranted}>
              <input type='hidden' name='user[member_permission_ids][]' />
              {features.map(feature => (
                <FeatureAccess key={feature} value={feature} checked={checkedFeatures.includes(feature)} onChange={this.handleFeatureChecked}>
                  {getFeatureName(feature) /* TODO: add extra space before */ }
                </FeatureAccess>
              ))}
              <ServiceFeatureAccess checked={this.allServicesChecked} onChange={this.handleFeatureChecked}>
                All current and future APIs
              </ServiceFeatureAccess>
            </FeatureAccessInput>

            <ServiceAccessList showServices={this.servicePermissionsGranted}>
              {services.map(service => (
                <ServiceAccess
                  key={service.id}
                  service={service}
                  checked={this.allServicesChecked || checkedServicesIds.includes(service.id)}
                  disabled={this.allServicesChecked}
                  checkedFeatures={checkedFeatures}
                  onChange={this.handleServiceChecked}
                />))}
            </ServiceAccessList>
          </li>
        )}
      </Inputs>
    )
  }
}

export const PermissionsFormWrapper = (props, element) => {
  const container = document.getElementById(element)
  if (container == null) {
    throw new Error(`${element} is not part of the DOM`)
  }

  render(<Form {...props} />, container)
}
