# frozen_string_literal: true

module Types
  class NftPaginationType < Types::BaseObject
    field :nfts, [Types::NftType], null: false
    field :totalPages, Int, null: false
  end
end
