# frozen_string_literal: true

require 'rails_helper'

describe Nft do
  describe 'ransackable_attributes' do
    it 'returns the correct attributes' do
      expect(described_class.ransackable_attributes(nil)).to eq(%w[
                                                                  price
                                                                  tokenId
                                                                  name
                                                                  seller
                                                                  teamName
                                                                  attack
                                                                  defense
                                                                  strength
                                                                ])
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:price) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_presence_of(:tokenId) }
  end
end
