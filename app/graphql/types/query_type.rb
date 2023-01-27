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
      description: 'Obtener todos los NFT filtrados por nombre, precio, defensa, ataque y poder' do
      argument :page, Integer, required: false
      argument :limit, Integer, required: false
      argument :name, String, required: false
      argument :orderBy, String, required: false
      argument :order, String, required: false
    end

    def getAllNfts(limit: nil, page: nil, name: nil, orderBy: nil, order: nil)
      nfts = Nft.all
      nfts = nfts.where('LOWER(name) like ?', "%#{name.downcase}%") if name.present?
      if orderBy.present? && ['ASC', 'DESC'].include?(order)
        puts 'NO ENTRA'
        nfts = nfts.order("#{orderBy} #{order}")
      end

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
