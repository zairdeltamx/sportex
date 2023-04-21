# frozen_string_literal: true

module Types
  class NftType < Types::BaseObject
    field :id, ID, null: false
    field :price, Float
    field :tokenId, Integer
    field :seller, String
    field :owner, String
    field :image, String
    field :name, String
    field :description, String
    field :meta, GraphQL::Types::JSON
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :attack, Float
    field :defense, Float
    field :strength, Float
    field :teamName, String
    field :presale_image_url, String, null: true

    def asset_url(asset)
      ActionController::Base.helpers.asset_path(asset)
    end

    def presale_image_url
      if object.presale_image.attached?
        object.presale_image.service_url
      else
        asset_url('profileDefault.png')
      end
    end
  end
end
