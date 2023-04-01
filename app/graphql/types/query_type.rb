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

    def getAllNfts(limit: nil, page: nil, name: nil, teamName: nil, attack: nil, defense: nil, strength: nil, orderBy: nil, order: nil)
      nfts = Nft.all

      # Filtrar por nombre
      nfts = nfts.where('LOWER(name) like ?', "%#{name.downcase}%") if name.present?

      # Filtrar por equipo
      nfts = nfts.where('LOWER("teamName") like ?', "%#{teamName.downcase}%") if teamName.present?

      # Filtrar por ataque, defensa o poder
      # if attack.present?
      #   nfts = nfts.where(attack: attack)
      # end
      # elsif defense.present?
      #   nfts = nfts.where(defense: defense)
      # elsif strength.present?
      #   nfts = nfts.where(strength: strength)
      # end

      # Ordenar los resultados
      if orderBy.present? && ['ASC', 'DESC'].include?(order)
        nfts = nfts.order("#{orderBy} #{order}")
      end

      nfts.paginate(page: page, per_page: limit)
    end

    field :getOneNft, Types::NftType, null: false,
                                      description: 'Get one Nft by id' do
      argument :id, ID, required: true
    end

    def getOneNft(id:)
      nft = Nft.find_by(id: id)
      nft
    end
  end
end
