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
      field :allNFTs, Types::NftPaginationType,
            description: "Obtener todos los NFT filtrados por nombre, precio, defensa, ataque, poder, equipo y vendedor" do
        argument :name, String, required: false
        argument :order, String, required: false
        argument :orderBy, String, required: false
        argument :seller, String, required: false
        argument :teamName, String, required: false 
        argument :page, GraphQL::Types::Int, required: false, default_value: 1
        argument :per_page, GraphQL::Types::Int, required: false, default_value: 4
      end

      field :getNFT, Types::NftType, null: false,
                                  description: "Get one Nft by id" do
        argument :id, Integer, required: true
      end
      field :teams, [String], null: false,
                              description: "Obtener todos los equipos únicos de NFTs disponibles"
    end

    def allNFTs(name: nil, order: nil, orderBy: nil, seller: nil, teamName: nil, status: nil, page:, per_page:)
      nfts = Nft.with_status(:available).ransack(
        name_cont: name,
        seller_eq: seller,
        teamName_cont: teamName,
        status_eq: status,
        s: "#{orderBy} #{order}"
      ).result.non_presale.page(page).per(per_page)

      {
        nfts: nfts,
        totalPages: nfts.total_pages,
      }
    end

    def getNFT(id:)
      Nft.find_by(id:)
    end

    def teams
      Nft.pluck(:teamName).uniq
    end
  end
end
