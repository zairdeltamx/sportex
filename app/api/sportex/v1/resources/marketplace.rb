# frozen_string_literal: true

module Sportex
  module V1
    module Resources
      class Marketplace < Grape::API
        desc 'Get all marketplace items'
        # fetch a URL and return the response body
        get :marketplace do
          HTTParty.get(
            "#{ENV.fetch('SPORTEX_API_URL', nil)}/marketplace"
          ).parsed_response
        end
      end
    end
  end
end
