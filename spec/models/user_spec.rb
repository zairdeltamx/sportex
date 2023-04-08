# frozen_string_literal: true

require 'rails_helper'

describe User do
  describe 'validations' do
    it { is_expected.to_not validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:username) }
    it { is_expected.to validate_presence_of(:eth_address) }
    it { is_expected.to validate_presence_of(:eth_nonce) }
  end
end
