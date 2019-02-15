// @flow

import 'raf/polyfill'
import 'core-js/es6/map'
import 'core-js/es6/set'
import 'core-js/es6/array'

import React from 'react'

import { Inputs } from 'Users/components/Inputs'
import { RoleInput } from 'Users/components/RoleInput'
import { UserRole } from 'Users/components/UserRole'
import { FeatureAccessInput } from 'Users/components/FeatureAccessInput'
import { FeatureAccess } from 'Users/components/FeatureAccess'
import { ServiceFeatureAccess } from 'Users/components/ServiceFeatureAccess'
import { ServiceAccessList } from 'Users/components/ServiceAccessList'
import { ServiceAccess } from 'Users/components/ServiceAccess'

import { isServicePermissionsGranted, getFeatureName } from 'Users/utils'
import { createReactWrapper } from 'utilities/createReactWrapper'

import type { Role, Feature } from 'Users/types'
import type { Service } from 'Types'

type Props = {
  initialState: any,
  features: Feature[],
  services: Service[]
}

type State = {
  role: Role,
  checkedFeatures: Feature[],
  checkedServicesIds: number[]
}

class PermissionsForm extends React.Component<Props, State> {
  state = {
    role: this.props.initialState.role || 'admin',
    checkedFeatures: this.props.initialState.admin_sections || [],
    checkedServicesIds: this.props.initialState.member_permission_service_ids || []
  }

  handleRoleChange = (role: Role) => this.setState({ role })

  handleFeatureChecked = (feature: Feature) => {
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
                  {getFeatureName(feature)}
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

const PermissionsFormWrapper = (props: Props, containerId: string) => createReactWrapper(<PermissionsForm {...props} />, containerId)

export { PermissionsForm, PermissionsFormWrapper }
