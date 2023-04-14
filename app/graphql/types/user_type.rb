# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    include Rails.application.routes.url_helpers

    field :id, ID, null: false
    field :eth_address, String, null: false
    field :token, String, null: true
    field :username, String, null: false
    field :email, String, null: true
    field :avatar_url, String, null: true
    # otros campos que necesites

    def avatar_url
      if object.avatar.attached?
        # rails_blob_url(object.avatar, host: 'https://sportex.herokuapp.com')
        rails_blob_url(object.avatar, only_path: true)
      else
        'Not Found'
      end
    end
  end
end
