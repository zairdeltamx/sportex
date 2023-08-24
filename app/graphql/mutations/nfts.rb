# frozen_string_literal: true

module Mutations
  module Nfts
    extend ActiveSupport::Concern

    included do
      field :mark_nft_as_sold, Types::NftType, null: false,
                                               description: 'Marks an NFT as sold' do
        argument :id, Integer, required: true
      end
    end

    def mark_nft_as_sold(id:)
      nft = Nft.find_by(id:)

      # Verificar si el NFT existe
      raise GraphQL::ExecutionError, "NFT with ID #{id} not found" if nft.nil?

      nft.update(status: 'sold')
      nft
    end
  end
end
