module Sportex
  module V1
    class Nfts < BaseApi
      # this function returns all nfts
      resource :nfts do
        desc 'Return list of NFTs'
        get do
          status 200
          nfts = Nft.all
          present nfts
        end
      end
      # end
      # this function saves all nfts
      resources :saveNfts do
        desc 'Save NFTs'
        params do
          requires :price, type: String
          requires :tokenId, type: Integer
          requires :seller, type: String
          requires :owner, type: String
          requires :image, type: String
          requires :name, type: String
          requires :defense, type: Float
          requires :attack, type: Float
          requires :strength, type: Float
          requires :description, type: String
          requires :meta, type: JSON
          # requires :meta_json, type: JSON
        end
        post do
          nft = Nft.find_by(tokenId: params[:tokenId])
          if nft
            if nft.price == params[:price] && nft.attack == params[:attack] && nft.defense == params[:defense] && nft.strength == params[:strength] && nft.seller == params[:seller] && nft.owner == params[:owner] && nft.image == params[:image] && nft.name == params[:name] && nft.description == params[:description] && nft.meta == params[:meta]
              # If there are no changes, do nothing
            else
              # If there are changes, update the NFT
              if nft.update({ price: params[:price], seller: params[:seller], owner: params[:owner], image: params[:image],attack: params[:attack],defense: params[:defense], strength: params[:strength],name: params[:name], description: params[:description], meta: params[:meta] })
                render json: { message: 'NFT updated' }, status: 201
              else
                render json: { message: 'NFT not updated' }, status: 422
              end
            end
          else
            # If the NFT does not exist, create it
            nft = Nft.new({ price: params[:price], tokenId: params[:tokenId], seller: params[:seller], owner: params[:owner], image: params[:image],attack: params[:attack],defense: params[:defense], strength: params[:strength], name: params[:name], description: params[:description], meta: params[:meta] })
            if nft.save
              render json: { message: 'NFT created' }, status: 201
            else
              render json: { message: 'NFT not created' }, status: 422
            end
          end
        end
      end

      # end
      # this function removes all nfts from the database
      resources :deleteNfts do
        desc 'Remove all nfts'
        get do
          if Nft.delete_all
            render response: {
              status: 'SUCCESS',
            }, status: :ok
          else
            render response: {
              status: 'ERROR',
            }, status: :unprocessable_entity
          end
        end
      end
      # end

      # this function removes an nft from id
      resources :delete_nft do
        desc 'Remove one nft for id'
        params do
          requires :id, type: Integer
        end
        delete ':id' do
          @nft = Nft.find(params[:id])
          if @nft.destroy
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

    #end
  end
end
