# frozen_string_literal: true

module Sportex
  module V1
    module Resources
      class AuthenticatedNfts < BaseApi
        get :current_user do
          HTTParty.get("#{ENV.fetch('SPORTEX_API_URL', nil)}/find_by/#{current_user.eth_address}")
        end
      end
    end
  end
end
