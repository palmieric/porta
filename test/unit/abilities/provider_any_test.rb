# frozen_string_literal: true

require 'test_helper'

class Abilities::ProviderAdminTest < ActiveSupport::TestCase
  def test_policies_no_rolling_update
    account = Account.new
    user = User.new({account: account}, without_protection: true)

    user.stubs(provider_can_use?: false)
    account.stubs(tenant?: true)
    account.stubs(provider?: true)
    assert_cannot Ability.new(user), :manage, :policies
  end

  def test_policies_no_tenant
    account = Account.new
    user = User.new({account: account}, without_protection: true)

    user.stubs(provider_can_use?: true)
    account.stubs(tenant?: false)
    account.stubs(provider?: true)
    assert_cannot Ability.new(user), :manage, :policies
  end

  def test_policies_allowed
    account = Account.new
    user = User.new({account: account}, without_protection: true)

    user.stubs(provider_can_use?: true)
    account.stubs(tenant?: true)
    account.stubs(provider?: true)
    assert_can Ability.new(user), :manage, :policies
  end
end
