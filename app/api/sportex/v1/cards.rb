module Sportex
  module V1
    class Cards < BaseApi
      resource :cards do
        desc 'Returns the cards for the marketplace'
        params do
          optional :q, type: JSON, desc: 'Ransack query param'
          use :paginatable
        end
        get do
          collection = []

          render collection
        end

        route_param :id do
          desc 'Deactivate a nfts from the user'
          params do
            requires :active, type: Boolean, desc: 'Status if a food is active/inactive for a user'
          end
          get do
            card = {}
            render card
          end
        end
      end
    end
  end
end
