# frozen_string_literal: true

module Types
  class NftType < Types::BaseObject
    field :id, ID, null: false
    field :price, String
    field :tokenId, Integer
    field :seller, String
    field :owner, String
    field :image, String
    field :name, String
    field :description, String
    field :meta, GraphQL::Types::JSON
    # field :meta_json, GraphQL::Types::JSON
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
