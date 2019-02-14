# frozen_string_literal: true

require 'test_helper'

class Admin::Api::Registry::PoliciesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @provider = FactoryBot.create(:provider_account)
    host! @provider.admin_domain
    @access_token = FactoryBot.create(:access_token, owner: @provider.admin_users.first!, scopes: %w[policy_registry], permission: 'rw').value
  end

  test 'POST create with valid params persists with those values' do
    assert_difference(@provider.policies.method(:count), 1) do
      post admin_api_registry_policies_path(policy_params)
    end
    assert_response :created
    assert JSON.parse(response.body).dig('policy', 'id')
    policy = @provider.policies.last!
    policy_params[:policy].each { |key, value| assert_equal(value, policy.public_send(key)) }
  end

  test 'POST create responds with an error message when it is incorrect' do
    FactoryBot.create(:policy, policy_params[:policy].merge(account: @provider))
    assert_no_difference(Policy.method(:count)) do
      post admin_api_registry_policies_path(policy_params)
    end
    assert_response :unprocessable_entity
    assert_equal ['has already been taken'], JSON.parse(response.body).dig('errors', 'version')
  end

  test 'POST create verifies permission' do
    token_admin_with_wrong_scope = FactoryBot.create(:access_token, owner: @provider.admin_users.first!, scopes: %w[account_management], permission: 'rw').value
    assert_no_difference(Policy.method(:count)) do
      post admin_api_registry_policies_path(policy_params(token_admin_with_wrong_scope))
    end
    assert_response :forbidden

    member_user = FactoryBot.create(:member, account: @provider)

    token_member_with_right_scope_but_no_permission = FactoryBot.create(:access_token, owner: member_user, scopes: %w[policy_registry], permission: 'rw').value
    assert_no_difference(Policy.method(:count)) do
      post admin_api_registry_policies_path(policy_params(token_member_with_right_scope_but_no_permission))
    end
    assert_response :forbidden

    member_user.member_permissions.create!(admin_section: :partners)
    token_member_with_wrong_scope = FactoryBot.create(:access_token, owner: member_user, scopes: %w[account_management], permission: 'rw').value
    assert_no_difference(Policy.method(:count)) do
      post admin_api_registry_policies_path(policy_params(token_member_with_wrong_scope))
    end
    assert_response :forbidden

    member_user.member_permissions.create!(admin_section: :policy_registry)
    token_member_with_right_scope = FactoryBot.create(:access_token, owner: member_user, scopes: %w[policy_registry], permission: 'rw').value
    assert_difference(@provider.policies.method(:count), 1) do
      post admin_api_registry_policies_path(policy_params(token_member_with_right_scope))
    end
    assert_response :created
  end

  def policy_params(token = @access_token)
    { policy: {name: 'my-name', version: 'my-version', schema: '{"foo": "bar"}'}, access_token: token }
  end
end