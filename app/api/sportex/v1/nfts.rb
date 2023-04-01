module Sportex
  module V1
    class Nfts < BaseApi
      # this function returns all nfts

      helpers do
        def notify_all_users_nft_destroy
          ActionCable.server.broadcast(
            'nftdeleted',
            {
              action: 'Updated NFTS DESDE RAILS',
            }
          )
        end
      end

      resource :nfts do
        desc 'Return list of NFTs'
        get do
          status 200
          nfts = Nft.all
          present nfts
        end

        params do
          requires :price, type: String
          requires :tokenId, type: Integer
          requires :seller, type: String
          requires :teamName, type: String
          requires :owner, type: String
          requires :image, type: String
          requires :name, type: String
          requires :defense, type: Float
          requires :attack, type: Float
          requires :strength, type: Float
          requires :description, type: String
          requires :sold, type: Boolean
          requires :meta, type: JSON
        end
        post do
          nft = Nft.find_by(tokenId: params[:tokenId])
          if nft
            nft.update status: params[:sold] ? 'sold' : 'available'

            if nft.teamName == params[:teamName] && nft.price == params[:price] && nft.attack == params[:attack] && nft.defense == params[:defense] && nft.strength == params[:strength] && nft.seller == params[:seller] && nft.owner == params[:owner] && nft.image == params[:image] && nft.name == params[:name] && nft.description == params[:description] && nft.meta == params[:meta]
              # If there are no changes, do nothing
            else
              # If there are changes, update the NFT
              if nft.update({ teamName: params[:teamName], price: params[:price], seller: params[:seller], owner: params[:owner], image: params[:image], attack: params[:attack], defense: params[:defense], strength: params[:strength], name: params[:name], description: params[:description], meta: params[:meta] })
                render json: { message: 'NFT updated' }, status: 201
              else
                render json: { message: 'NFT not updated' }, status: 422
              end
            end
          else
            # If the NFT does not exist, create it
            nft = Nft.new({ teamName: params[:teamName], price: params[:price], tokenId: params[:tokenId], seller: params[:seller], owner: params[:owner], image: params[:image], attack: params[:attack], defense: params[:defense], strength: params[:strength], name: params[:name], description: params[:description], meta: params[:meta] })
            if nft.save
              render json: { message: 'NFT created' }, status: 201
            else
              render json: { message: 'NFT not created' }, status: 422
            end
          end
        end

        route_param :id do
          delete do
            @nft = Nft.find(params[:id])

            if @nft.update status: 'sold'
              notify_all_users_nft_destroy()
              render json: {
                message: 'NFT deleted',
              }, status: :no_content
            else
              render json: {
                message: 'NFT not deleted',
              }, status: :unprocessable_entity
            end
          end
        end
      end
    end
  end
end
