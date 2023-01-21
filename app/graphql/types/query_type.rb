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
          description: 'Get all nfts filtered by name, price, defense, attack and power' do
      argument :page, Integer, required: false
      argument :limit, Integer, required: false
      argument :name, String, required: false
      argument :price, Integer, required: false
      argument :defense, Integer, required: false
      argument :attack, Integer, required: false
      argument :power, Integer, required: false
    end

    def getAllNfts(limit: nil, page: nil, name: nil, price: nil, defense: nil, attack: nil, power: nil)
      nfts = Nft.all

      nfts = nfts.where('name like ?', "%#{name}%") if name.present?
      nfts = nfts.where(price: price) if price.present?
      nfts = nfts.where(defense: defense) if defense.present?
      nfts = nfts.where(attack: attack) if attack.present?
      nfts = nfts.where(power: power) if power.present?

      nfts.paginate(page: page, per_page: limit)
    end

    field :getOneNft, Types::NftType, null: false,
                                      description: 'Get one Nft by id' do
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
