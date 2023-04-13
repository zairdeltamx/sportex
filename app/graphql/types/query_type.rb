# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    include Queries::Nfts
    include Queries::Users
  end
end
