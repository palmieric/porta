import React from 'react'
import { PolicyTile } from 'Policies/components/PolicyTile'
import 'Policies/styles/policies.scss'

const policyEditLink = id => `/p/admin/custom_policies/${id}/edit`

const navigateToEditPolicy = url => {
  window.location.href = url
  history.pushState(null, null, url)
}

const PolicyList = function ({items}) {
  return (
    <ul className='list-group'>
      {items.map((policy, index) => (
        <PolicyTile
          edit={() => navigateToEditPolicy(policyEditLink(policy.id))}
          policy={policy}
          key={index}
        />
      ))}
    </ul>
  )
}

export { PolicyList }
