# frozen_string_literal: true

module Mutations
  module Nfts
    extend ActiveSupport::Concern

    included do
      field :mark_as_sold, Types::NftType, null: false,
                                           description: 'Marks an NFT as sold' do
        argument :token_id, Integer, required: true
      end
    end

    def mark_as_sold(token_id:)
      nft = Nft.find_by(tokenId: token_id)
      nft.update status: 'sold'
      nft
    end
  end
end
