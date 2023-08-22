# frozen_string_literal: true

module Sportex
  module V1
    module Resources
      class Nfts < BaseApi
        # this function returns all nfts

        resource :nfts do
          params do
            use :nft_params
          end

          desc 'Create a new NFT', hidden: true
          post do
            nft = Nft.find_or_initialize_by(tokenId: params[:tokenId])

            nft.assign_attributes(extract(params))

            if nft.changed? && nft.update(extract(params))
              render json: { message: 'NFT updated' }
            else
              render json: { message: 'NFT not updated' }
            end
          end
        end
      end
    end
  end
end
