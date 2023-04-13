# frozen_string_literal: true

module Sportex
  module V1
    class UnauthenticatedApi < BaseApi
      formatter :json, Grape::Formatter::ActiveModelSerializers
      mount Sportex::V1::Resources::Nfts
    end
  end
end
