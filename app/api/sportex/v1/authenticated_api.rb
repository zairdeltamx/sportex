module Sportex
  module V1
    class AuthenticatedApi < Grape::API
      before { authenticate! }

      mount Sportex::V1::Cards
      mount Sportex::V1::Nfts
    end
  end
end
