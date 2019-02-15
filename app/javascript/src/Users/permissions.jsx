import React from 'react'
import { render } from 'react-dom'

import 'core-js/fn/object/assign' // make Object.assign on IE 11
import 'core-js/fn/array/includes'

import { Inputs } from 'Users/components/Inputs'
import { RoleInput } from 'Users/components/RoleInput'
import { UserRole } from 'Users/components/UserRole'
import { FeatureAccessInput } from 'Users/components/FeatureAccessInput'
import { FeatureAccess } from 'Users/components/FeatureAccess'
import { ServiceFeatureAccess } from 'Users/components/ServiceFeatureAccess'
import { ServiceAccessList } from 'Users/components/ServiceAccessList'
import { ServiceAccess } from 'Users/components/ServiceAccess'
import { getFeatureName, isServicePermissionsGranted } from './utils'

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
