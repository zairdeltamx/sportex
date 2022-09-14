# frozen_string_literal: true

require 'eth'

module Api
  module Sportex
    module V1
      class UsersController < ApiController
        # creates a public API that allows fetching the user nonce by address
        def show
          user = nil
          response = nil
          # checks the parameter is a valid eth address
          params_address = Eth::Address.new params[:id]
          if params_address.valid?
            # finds user by valid eth address (downcase to prevent checksum mismatchs)
            user = User.find_by(eth_address: params[:id].downcase)
          end
          # do not expose full user object; just the nonce
          response = [eth_nonce: user.eth_nonce] if user&.id&.positive?
          # return response if found or nil in case of mismatch
          render json: response
        end
      end
    end
  end
end
