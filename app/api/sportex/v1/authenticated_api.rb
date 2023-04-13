# frozen_string_literal: true

module Sportex
  module V1
    class AuthenticatedApi < BaseApi
      before { authenticate! }

      mount Sportex::V1::Resources::Marketplace
      mount Sportex::V1::Resources::AuthenticatedNfts
    end
  end
end
