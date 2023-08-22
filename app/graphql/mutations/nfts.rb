module Mutations
  module Nfts
    extend ActiveSupport::Concern

    included do
      field :mark_as_sold, Types::NftType, null: false,
                                  description: 'Marks an NFT as sold' do
        argument :tokenId, Integer, required: true
      end
    end

    def mark_as_sold(tokenId:)
      nft = Nft.find_by(tokenId: tokenId)
      nft.update status: 'sold'
      nft
    end
  end
end
