# frozen_string_literal: true

module Sportex
  module V1
    module Helpers
      module SharedParams
        extend Grape::API::Helpers

        params :nft_params do
          requires :price, type: String
          requires :tokenId, type: Integer
          requires :seller, type: String
          optional :teamName, type: String
          requires :owner, type: String
          requires :image, type: String
          requires :name, type: String
          requires :defense, type: Float
          requires :attack, type: Float
          requires :strength, type: Float
          optional :description, type: String
          optional :sold, type: Boolean
          requires :meta, type: String
        end

        params :paginatable do
          optional :page, type: String, desc: 'Current page.', default: 1
          optional :per, type: String, desc: 'Number of items per page.', default: 20
        end
      end
    end
  end
end
