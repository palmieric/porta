/** @jsx element */

import $ from 'jquery'
import { dom, element } from 'decca' // eslint-disable-line no-unused-vars

import {
  Form
} from 'Users/permissions'

function render (el, context = {}, dispatch) {
  let doc = document.createDocumentFragment()
  let render = dom.createRenderer(doc, dispatch)
  render(el, context)

  return doc.firstChild
}

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
