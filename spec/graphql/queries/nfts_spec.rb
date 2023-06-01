# frozen_string_literal: true

require 'rails_helper'

describe SportexSchema, elasticsearch: true, turnip_vcr: true do
  let(:context) { {} }
  let(:variables) { {} }

  let(:result) do
    SportexSchema.execute(
      query_string,
      context:,
      variables:
    )
  end

  describe 'querying for states index' do
    let!(:nfts) { create_list(:nft, 3, presale: false) }

    let(:query_string) do
      %|
      query {
        nfts {
          collection {
            id
            name
            price
            defense
            attack
            teamName
            owner
            image
            description
            tokenId
            strength
          }
          metadata {
            totalPages
            totalCount
          }
        }
      }
      |
    end

    subject { result['data']['nfts'] }

    it 'returns a list of states with a cities count' do
      expect(subject['collection'].size).to eq Nft.count
    end
  end
end
