module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    class MyMetadataType < GraphqlPagination::CollectionMetadataType
      def total_count
        object.total_entries
      end
    end

    field :getAllNfts, Types::NftType.collection_type(metadata_type: MyMetadataType),
      description: "Get all nfts" do
      argument :page, Integer, required: false
      argument :limit, Integer, required: false
    end
    ##
    # `getAllNfts` returns a paginated list of all NFTs
    def getAllNfts(limit: nil, page: nil)
      Nft.paginate(page: page, per_page: limit)
    end

    field :getOneNft, Types::NftType, null: false,
                                  description: "Get one Nft by id" do
      argument :id, ID, required: true
    end
    ##
    # `getOneNft` is a function that takes an id as an argument and returns a JSON object of the NFT
    # with that id
    def getOneNft(id:)
      nft = Nft.find(id)
      NftBlueprint.render_as_json(nft)
    end
  end
end
