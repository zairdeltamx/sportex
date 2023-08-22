# frozen_string_literal: true

module Sportex
  module V1
    class UnauthenticatedApi < BaseApi
      mount Sportex::V1::Resources::Nfts
    end
  end
end
