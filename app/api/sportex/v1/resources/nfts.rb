# frozen_string_literal: true

module Sportex
  module V1
    module Resources
      class Nfts < BaseApi
        # this function returns all nfts

        helpers do
          def notify_all_users_nft_destroy
            ActionCable.server.broadcast(
              'nftdeleted',
              {
                action: 'Updated NFTS DESDE RAILS'
              }
            )
          end
        end

        resource :nfts do
          params do
            use :nft_params
          end
          post do
            nft = Nft.find_or_initialize_by(tokenId: params[:tokenId])

            nft.assign_attributes(extract(params))

            if nft.changed? && nft.update(extract(params))
              render json: { message: 'NFT updated' }
            else
              render json: { message: 'NFT not updated' }
            end
          end

          route_param :id do
            delete do
              @nft = Nft.find(params[:id])

              if @nft.update status: 'sold'
                notify_all_users_nft_destroy
                render json: {
                  message: 'NFT deleted'
                }, status: :no_content
              end
            end
          end
        end
      end
    end
  end
end
