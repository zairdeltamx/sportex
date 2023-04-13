# frozen_string_literal: true

require 'rails_helper'

describe SportexSchema, elasticsearch: true, turnip_vcr: true do
  let(:context) { { current_user: user } }
  let(:variables) { {} }

  let(:result) do
    SportexSchema.execute(
      query_string,
      context:,
      variables:
    )
  end

  describe 'querying for users' do
    let!(:user) { create(:user) }

    let(:query_string) do
      %|
      query {
        currentUser {
          id
          ethAddress
          token
        }
      }
      |
    end

    subject { result['data']['currentUser'] }

    it 'returns a list of states with a cities count' do
      expect(subject['token']).to_not be_nil
    end
  end
end
