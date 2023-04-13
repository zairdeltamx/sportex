# frozen_string_literal: true

module Queries
  module Users
    extend ActiveSupport::Concern

    included do
      field :current_user, Types::UserType, null: true
    end

    def current_user
      context[:current_user]
    end
  end
end
