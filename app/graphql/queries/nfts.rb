# frozen_string_literal: true

module Queries
  module Nfts
    extend ActiveSupport::Concern

    class MetadataTypeNft < GraphqlPagination::CollectionMetadataType
      def total_count
        object.total_count
      end
    end

    included do
      field :nfts, Types::NftType.collection_type(metadata_type: MetadataTypeNft),
            description: 'Obtener todos los NFT filtrados por nombre, precio, defensa, ataque, poder y equipo' do
        argument :page, Integer, required: false
        argument :limit, Integer, required: false
        argument :name, String, required: false
        argument :teamName, String, required: false
        argument :attack, Integer, required: false
        argument :defense, Integer, required: false
        argument :strength, Integer, required: false
        argument :orderBy, String, required: false
        argument :order, String, required: false
      end

      field :nft, Types::NftType, null: false,
                                  description: 'Get one Nft by id' do
        argument :tokenId, Integer, required: true
      end

      field :teams, [String], null: false,
                              description: 'Obtener todos los equipos únicos de NFTs disponibles'
    end

    def nfts(limit: nil, page: nil, name: nil, teamName: nil, attack: nil, defense: nil,
             strength: nil, orderBy: nil, order: nil)
      search_params = {}
      search_params[:name_cont] = name.downcase if name.present?
      search_params[:teamName_cont] = teamName.downcase if teamName.present?
      search_params[:s] = "#{orderBy} #{order}" if orderBy.present? && ['ASC',
                                                                        'DESC'].include?(order)

      # Use Ransack to search for Nfts and paginate the results
      nfts = Nft.with_status(:available)
                .ransack(search_params)
                .result
                .page(page)
                .per(limit)
    end

    def nft(tokenId:)
      Nft.find_by(tokenId: tokenId)
    end

    def teams
      Nft.pluck(:teamName).uniq
    end
  end
end
