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
      query allNfts(
        $page: Int
        $name: String
        $orderBy: String
        $perPage: Int
        $order: String
        $teamName: String
        $seller: String
      ) {
        allNFTs(
          page: $page
          perPage: $perPage
          seller: $seller
          teamName: $teamName
          name: $name
          orderBy: $orderBy
          order: $order
        ) {
          nfts {
            id
            name
            price
            defense
            attack
            status
            teamName
            seller
            owner
            image
            description
            tokenId
            strength
          }
          totalPages
        }
      }
      |
    end

    subject { result['data']['allNFTs'] }

    it 'returns a list of states with a cities count' do
      expect(subject['nfts'].size).to eq Nft.count
    end
  end
end
