# frozen_string_literal: true

module Sportex
  module V1
    class AuthenticatedApi < Grape::API
      before { authenticate! }

      mount Sportex::V1::Cards
    end
  end
end
